'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Menu, X } from 'lucide-react';

export default function Sidebar({ role, links = [] }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeVars = () => {
    switch(role) {
      case 'collector': return { gradient: 'from-amber-500 to-orange-500', activeBg: 'bg-amber-500/10', activeText: 'text-amber-400', activeBorder: 'border-amber-500', badgeClass: 'bg-amber-500/20 text-amber-400' };
      case 'admin': return { gradient: 'from-indigo-500 to-purple-500', activeBg: 'bg-indigo-500/10', activeText: 'text-indigo-400', activeBorder: 'border-indigo-500', badgeClass: 'bg-indigo-500/20 text-indigo-400' };
      default: return { gradient: 'from-emerald-500 to-cyan-500', activeBg: 'bg-emerald-500/10', activeText: 'text-emerald-400', activeBorder: 'border-emerald-500', badgeClass: 'bg-emerald-500/20 text-emerald-400' };
    }
  };

  const theme = getThemeVars();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl text-white">
      {/* Top Profile Section */}
      <div className="p-8 border-b border-white/[0.05] flex flex-col items-center bg-white/[0.02]">
        <div className={`relative group mb-6`}>
          <div className={`absolute -inset-1 bg-gradient-to-br ${theme.gradient} rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200`}></div>
          <div className={`relative w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl`}>
            <span className="text-white font-black text-3xl drop-shadow-2xl">{session?.user?.name?.charAt(0) || role.charAt(0).toUpperCase()}</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-black flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50`}>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
        
        <h2 className="font-black text-xl text-white mb-2 truncate w-full text-center tracking-tight uppercase">{session?.user?.name || role}</h2>
        <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${theme.badgeClass}`}>
          {role} SECURED
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-3">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={idx} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive ? `glass ${theme.activeText} border-white/10 shadow-xl` : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'}`}
            >
              {isActive && (
                <div className={`absolute inset-y-0 left-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]`}></div>
              )}
              <Icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-emerald-400'}`} />
              <span className={`font-black text-[10px] uppercase tracking-[0.2em] ${isActive ? 'text-white' : ''}`}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/[0.05] mt-auto">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="flex items-center justify-center gap-3 w-full px-5 py-4 text-gray-500 hover:text-red-400 glass border border-white/5 hover:border-red-500/30 rounded-2xl transition-all duration-500 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-[0.3em]">Terminate Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - absolutely positioned on small screens */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-[18px] left-4 z-50 bg-[#111111] border border-white/20 p-2 rounded-xl text-white shadow-xl hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar Fixed */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-40 border-r border-white/10 shadow-2xl pt-16 bg-[#111111]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[70] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex`}>
        <div className="w-72 h-full relative transition-transform shadow-2xl border-r border-white/10 bg-[#111111]">
          {/* Close button internal to sidebar */}
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 transition-colors z-[80] shadow-sm">
             <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </div>
        <div className={`flex-1 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
      </div>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block w-72 shrink-0 bg-[#0A0A0A]" />
    </>
  );
}
