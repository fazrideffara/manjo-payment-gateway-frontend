import React, { useState, useEffect } from 'react';
import { Bell, LogOut, CheckCircle, AlertTriangle, Info, Clock, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';

export default function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const loadNotifications = () => {
    const history = JSON.parse(localStorage.getItem('notif_history') || '[]');
    setNotifications(history);
    setHasNew(history.some(n => !n.read));
  };

  useEffect(() => {
    loadNotifications();
    const handleNewNotif = () => loadNotifications();
    window.addEventListener('new_notification', handleNewNotif);
    return () => window.removeEventListener('new_notification', handleNewNotif);
  }, []);

  const handleLogout = () => {
    setShowToast(true);
    setTimeout(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      navigate('/login');
    }, 1500);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notif_history', JSON.stringify(updated));
    setNotifications(updated);
    setHasNew(false);
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-8 py-4">
      <div className="max-w-full mx-auto flex items-center justify-between">
        
        {/* Logo - Kiri */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-manjo-green rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">ManjoPay</span>
        </div>

        {/* Action Group - Kanan */}
        <div className="flex items-center gap-6">
          
          {/* Lonceng Notifikasi */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all relative"
            >
              <Bell size={20} />
              {hasNew && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifikasi</span>
                  <button 
                    onClick={() => { localStorage.setItem('notif_history', '[]'); setNotifications([]); setHasNew(false); setShowNotifications(false); }}
                    className="text-[10px] font-bold text-red-400"
                  >
                    Hapus
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-300 text-xs font-bold">Belum ada aktivitas</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 flex gap-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                        <div className={`mt-0.5 ${n.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                          {n.type === 'success' ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 leading-tight">{n.message}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">{n.detail}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Info - Clickable */}
          <div 
            className="flex items-center gap-3 border-l border-slate-100 pl-6 cursor-pointer group"
            onClick={() => navigate('/profile')}
          >
            <div className="flex flex-col items-end group-hover:opacity-70 transition-opacity">
              <span className="text-[11px] font-black text-slate-900 leading-none tracking-tight">
                {localStorage.getItem('userName') || 'SUPERADMIN'}
              </span>
              <span className="text-[9px] font-bold text-manjo-green uppercase tracking-widest mt-1">
                {localStorage.getItem('userRole') || 'ADMINISTRATOR'}
              </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-manjo-green transition-all">
              <User size={20} />
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
      {showToast && (
        <Toast 
          message="Logout Berhasil" 
          detail="Sesi Anda telah diakhiri. Sampai jumpa!"
          onClose={() => setShowToast(false)}
        />
      )}
    </nav>
  );
}
