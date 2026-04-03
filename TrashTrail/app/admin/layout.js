'use client';

import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, Map, ShieldAlert, Users, BellRing } from 'lucide-react';

export default function AdminLayout({ children }) {
  const links = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/map", icon: Map, label: "Live Map" },
    { href: "/admin/anomalies", icon: ShieldAlert, label: "Anomalies" },
    { href: "/admin/contractors", icon: Users, label: "Contractors" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row font-sans text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <Sidebar role="admin" links={links} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] min-h-screen relative pt-20 lg:pt-10 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden flex flex-col">
        
        {/* Header Alert Bar (Admin Specific) */}
        <div className="hidden lg:flex w-full glass-indigo border border-indigo-500/20 rounded-2xl p-6 mb-8 items-center justify-between shadow-2xl relative z-10">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
               <span className="text-xl">🛡️</span>
             </div>
             <div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Authority Command Center</h3>
               <p className="text-xs text-gray-400 font-medium">Monitoring secure municipal infrastructure</p>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors group">
                <BellRing className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </div>
           </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[180px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Child Routes Render Here */}
        <div className="max-w-[1400px] mx-auto w-full relative z-0 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
