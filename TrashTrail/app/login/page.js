'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please verify your email and password.");
      setLoading(false);
    } else {
      // Get updated session to read role for redirect
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      const role = session?.user?.role || 'citizen';
      router.push(`/${role}/dashboard`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-12 px-4 selection:bg-emerald-500/30">
      {/* Background Layer: Grid + Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid bg-grid-animate opacity-[0.1]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] animate-float-slow [animation-delay:2s]"></div>
      </div>
      
      {/* Center Card */}
      <div className="glass max-w-md w-full p-8 md:p-10 relative z-10 premium-shadow">
        
        <div className="text-center mb-10">
          <div className="inline-block text-5xl mb-6 hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-default">🌿</div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Login Core</h2>
          <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Access Private Subsystem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Identity Endpoint</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
              <input
                type="email"
                required
                placeholder="mail@trashtrail.com"
                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Access Cipher</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 w-5 h-5 transition-colors z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-medium text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors z-10 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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
              <>Initiate Access <span className="group-hover:translate-x-1 transition-transform">→</span></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/[0.05] text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Identity missing?{' '}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4">
              Register Node
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
