import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/common/Toast';
import { Lock, User, ArrowRight, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired')) {
      setSessionExpired(true);
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/v1/auth/login', {
        username,
        password
      });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userName', response.data.name || 'Admin Manjo');
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userEmail', response.data.email || 'admin@manjo.id');
      
      setShowToast(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Username atau Password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 overflow-hidden border border-white">
        
        {/* Header Section */}
        <div className="bg-manjo-navy p-10 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-manjo-green rounded-full blur-3xl opacity-30"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-manjo-green rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-manjo-green/20">
               <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Manjo Payment</h1>
            <p className="text-manjo-green text-xs font-black uppercase tracking-widest mt-1">Admin Dashboard Access</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-manjo-green transition-colors" size={18} />
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green focus:ring-4 ring-manjo-green/10 outline-none transition-all font-bold"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-manjo-green transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green focus:ring-4 ring-manjo-green/10 outline-none transition-all font-bold"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-manjo-green transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-manjo-navy text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (
                <>
                  SIGN IN TO DASHBOARD
                  <ArrowRight size={20} className="text-manjo-green" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
             <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold">
               <Zap size={14} className="text-manjo-green" />
               SECURE ENCRYPTED CONNECTION
             </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast 
          message="Login Berhasil!" 
          detail={`Selamat datang kembali, ${localStorage.getItem('userName')}`}
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}
