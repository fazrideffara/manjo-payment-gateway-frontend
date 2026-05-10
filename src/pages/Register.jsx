import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowRight, UserPlus, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
      
      // Simpan data login (karena register biasanya langsung login)
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userRole', response.data.role);
      
      navigate('/');
    } catch (err) {
      setError('Registrasi gagal. Username mungkin sudah digunakan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
        
        <div className="bg-manjo-navy p-10 text-white relative text-center">
          <div className="w-16 h-16 bg-manjo-green rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
             <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Create Account</h1>
          <p className="text-manjo-green text-xs font-black uppercase tracking-widest mt-1">Join Manjo Payment Gateway</p>
        </div>

        <div className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Full Name</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" required
                  placeholder="john@example.com"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" required
                  placeholder="johndoe"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-manjo-green outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              type="submit" disabled={loading}
              className="w-full bg-manjo-navy text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all"
            >
              {loading ? 'Processing...' : <><UserPlus size={20} className="text-manjo-green" /> REGISTER NOW</>}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-400 text-xs font-bold">
              Already have an account? <Link to="/login" className="text-manjo-green hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
