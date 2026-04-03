'use client';

import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, ScanLine, Package } from 'lucide-react';

export default function CollectorLayout({ children }) {
  const links = [
    { href: "/collector/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/collector/scan", icon: ScanLine, label: "Scan QR" },
    { href: "/collector/pickups", icon: Package, label: "My Pickups" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row font-sans text-white selection:bg-amber-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <Sidebar role="collector" links={links} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] min-h-screen relative pt-20 lg:pt-10 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Decorative Background Elements restricted to main view */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Child Routes Render Here */}
        <div className="max-w-7xl mx-auto w-full relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
