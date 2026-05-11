import React, { useState } from 'react';
import { User, Mail, Shield, Save, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { transactionApi } from '../api/transactionApi';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    username: localStorage.getItem('userUsername') || 'admin', 
    email: localStorage.getItem('userEmail') || 'admin@manjo.id'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await transactionApi.updateProfile({
        name: formData.name
      });
      localStorage.setItem('userName', formData.name);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-manjo-green transition-all mb-8 font-bold text-sm"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
          <div className="bg-manjo-navy p-12 text-white relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-manjo-green rounded-full blur-3xl opacity-20"></div>
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-8">
              <div className="w-24 h-24 bg-manjo-green rounded-[2rem] flex items-center justify-center shadow-2xl shadow-manjo-green/20 border-4 border-white/10">
                <User size={48} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-black tracking-tight">{formData.name}</h1>
                <p className="text-manjo-green font-black uppercase tracking-widest text-xs mt-1">System Administrator</p>
              </div>
            </div>
          </div>

          <div className="p-12">
            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold border border-emerald-100 mb-8 animate-in slide-in-from-top-4">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-manjo-green transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green focus:ring-4 ring-manjo-green/10 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Username</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.username}
                      disabled
                      className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-transparent rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-transparent rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic ml-2">Email cannot be changed by the user for security reasons.</p>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-manjo-navy text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
