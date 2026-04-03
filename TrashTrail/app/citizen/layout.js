'use client';

import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, QrCode, Search, AlertCircle } from 'lucide-react';

export default function CitizenLayout({ children }) {
  const links = [
    { href: "/citizen/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/citizen/generate-qr", icon: QrCode, label: "Generate QR" },
    { href: "/citizen/track", icon: Search, label: "Track Waste" },
    { href: "/citizen/report", icon: AlertCircle, label: "Report Issue" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row font-sans text-white selection:bg-emerald-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <Sidebar role="citizen" links={links} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] min-h-screen relative pt-20 lg:pt-10 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Decorative Background Elements restricted to main view */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Child Routes Render Here */}
        <div className="max-w-7xl mx-auto w-full relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
