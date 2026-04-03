'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Leaf, Menu, X, LogOut, User, Globe } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'citizen': return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Citizen</span>;
      case 'collector': return <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Collector</span>;
      case 'admin': return <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Admin</span>;
      default: return null;
    }
  };

  const dashboardLink = session?.user?.role ? `/${session.user.role}/dashboard` : '/';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo - Premium Evolution */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative glass bg-black/40 border border-white/10 p-2 rounded-xl group-hover:bg-white/5 transition-colors">
                  <Leaf className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-500" />
                  <Globe className="w-3 h-3 text-indigo-400 absolute -bottom-0.5 -right-0.5 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-white tracking-tighter leading-none group-hover:tracking-normal transition-all duration-500">
                  Trash<span className="text-emerald-400">Trail</span>
                </span>
                <span className="text-[7px] font-black text-gray-500 uppercase tracking-[0.4em] leading-none mt-1 group-hover:text-gray-400 transition-colors">
                  Systems Directive
                </span>
              </div>
            </Link>

            {/* Desktop Center Links - Enhanced Interactions */}
            {!session && (
              <div className="hidden md:flex items-center gap-10">
                {['How It Works', 'Features', 'Impact'].map((item) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                    className="relative text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-500 group/link"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all duration-300 group-hover/link:w-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  </a>
                ))}
              </div>
            )}

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
              {!session ? (
                <>
                  <Link href="/login" className="text-sm font-bold text-white border border-white/20 hover:bg-white/10 rounded-xl px-5 py-2 transition-all duration-300">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl px-5 py-2 glow-emerald transition-all duration-300 shadow-lg">
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href={dashboardLink} className="flex items-center gap-3 hover:opacity-80 transition-opacity bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10">
                    <span className="text-sm font-bold text-white">{session.user.name}</span>
                    {getRoleBadge(session.user.role)}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/30">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(true)} className="text-white p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div className={`fixed inset-0 z-[60] transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-out`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-black/95 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col shadow-2xl">
          <div className="flex justify-end p-2 bg-white/5 rounded-xl border border-white/10 mb-8 cursor-pointer hover:bg-white/10 transition-colors w-10 h-10 items-center" onClick={() => setMenuOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col gap-6">
            {!session ? (
              <>
                <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-400 hover:text-white transition-colors">How It Works</a>
                <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#impact" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-gray-400 hover:text-white transition-colors">Impact</a>
                <div className="h-px w-full bg-white/10 my-2" />
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-center text-lg font-bold text-white border border-white/20 hover:bg-white/10 rounded-xl px-4 py-3 transition-colors">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-center text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl px-4 py-3 glow-emerald transition-colors shadow-lg">Get Started</Link>
              </>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 items-center flex flex-col gap-3 shadow-inner">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center glow-emerald shadow-lg border-2 border-emerald-400">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg leading-tight">{session.user.name}</p>
                    <div className="mt-2">{getRoleBadge(session.user.role)}</div>
                  </div>
                </div>
                <Link href={dashboardLink} onClick={() => setMenuOpen(false)} className="text-lg font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-center transition-all shadow-sm">Go to Dashboard</Link>
                <div className="mt-auto pt-4 border-t border-white/10">
                  <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="w-full flex justify-center items-center gap-2 text-lg font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl px-4 py-3 transition-all">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
