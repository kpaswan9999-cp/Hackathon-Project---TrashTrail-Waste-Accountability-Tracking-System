'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', ward: '', role: 'citizen'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/users', formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Email may be configured already.');
      setLoading(false);
    }
  };

  const handleRoleToggle = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-20 px-4 selection:bg-emerald-500/30">
      {/* Background Layer: Grid + Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid bg-grid-animate opacity-[0.1]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] animate-float-slow [animation-delay:2s]"></div>
      </div>
      
      <div className="glass max-w-2xl w-full p-8 md:p-12 relative z-10 premium-shadow">
        
        <div className="text-center mb-12">
          <div className="inline-block text-5xl mb-6 hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-default">🌿</div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Create Identity</h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Join the Waste Accountability Network</p>
        </div>

        {success ? (
           <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-8 glow-emerald">
               <CheckCircle2 className="w-12 h-12 text-emerald-400" />
             </div>
             <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Access Granted</h3>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Redirecting to Login terminal...</p>
           </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Legal Designation</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
                <input
                  type="text" required placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Comlink Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
                <input
                  type="tel" required placeholder="+91 9999999999"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Secure Email Gateway</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
              <input
                type="email" required placeholder="gateway@trashtrail.com"
                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Initial Passphrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="Minimum 8 chars"
                  className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Zone Assignment</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
                <input
                  type="text" required placeholder="Ward Number / Sector"
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                  value={formData.ward} onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block text-center mb-6">Select Operational Role</label>
            <div className="grid grid-cols-2 gap-6">
              
              <div 
                onClick={() => handleRoleToggle('citizen')}
                className={`glass p-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center border-2 group shadow-lg ${formData.role === 'citizen' ? 'border-emerald-500/50 bg-emerald-500/10 glow-emerald scale-[1.02]' : 'border-white/[0.05] hover:border-white/20 hover:bg-white/[0.05]'}`}
              >
                <div className={`text-4xl mb-4 ${formData.role === 'citizen' ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>👤</div>
                <h4 className={`font-black uppercase tracking-widest text-sm ${formData.role === 'citizen' ? 'text-emerald-400' : 'text-gray-400'}`}>Citizen</h4>
              </div>

              <div 
                onClick={() => handleRoleToggle('collector')}
                className={`glass p-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center border-2 group shadow-lg ${formData.role === 'collector' ? 'border-amber-500/50 bg-amber-500/10 glow-amber scale-[1.02]' : 'border-white/[0.05] hover:border-white/20 hover:bg-white/[0.05]'}`}
              >
                <div className={`text-4xl mb-4 ${formData.role === 'collector' ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>👷</div>
                <h4 className={`font-black uppercase tracking-widest text-sm ${formData.role === 'collector' ? 'text-amber-400' : 'text-gray-400'}`}>Collector</h4>
              </div>

            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-fadeInUp">
              <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs font-bold leading-tight uppercase tracking-wider">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Construct Identity <span className="group-hover:translate-x-1 transition-transform">→</span></>
            )}
          </button>
        </form>
        )}

         <div className="mt-12 pt-8 border-t border-white/[0.05] text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Identity Secured?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4">
                Access Terminal
              </Link>
            </p>
        </div>

      </div>
    </div>
  );
}
