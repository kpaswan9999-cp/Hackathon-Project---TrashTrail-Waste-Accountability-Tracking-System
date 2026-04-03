'use client';

import dynamic from 'next/dynamic';
import { Map, Loader2 } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-[#0A0A0A] rounded-2xl border border-white/10 flex flex-col items-center justify-center p-8 glass-card shadow-inner relative overflow-hidden">
      
      <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full"></div>

      <div className="relative flex items-center justify-center mb-8 z-10 w-24 h-24">
        <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-[ping_3s_infinite] opacity-50"></div>
        <Map className="w-12 h-12 text-emerald-500 opacity-80" />
        <Loader2 className="w-16 h-16 text-emerald-400/50 animate-spin absolute" />
      </div>

      <h3 className="text-xl font-black text-white tracking-tight mb-2 z-10">Connecting to Satellites</h3>
      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest z-10 text-center">Establishing secure link to GPS telemetry network...</p>
      
      <div className="mt-10 flex gap-3 w-48 justify-center z-10">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping delay-100"></div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping delay-200"></div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping delay-300"></div>
      </div>
    </div>
  ) 
});

export default function MapView({ markers = [], center = [28.6139, 77.2090], zoom = 12 }) {
  return <MapComponent markers={markers} center={center} zoom={zoom} />;
}
