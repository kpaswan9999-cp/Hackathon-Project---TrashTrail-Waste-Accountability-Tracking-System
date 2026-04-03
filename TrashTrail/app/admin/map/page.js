'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Map, Package, AlertTriangle, Building2, Filter } from 'lucide-react';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => (
  <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-3xl border border-slate-200 flex items-center justify-center">
    <Map className="h-10 w-10 text-slate-300" />
  </div>
) });

// DUMMY MARKERS
const DUMMY_MARKERS = [
  { id: 1, lat: 28.6139, lng: 77.2090, type: 'collection', ward: 'W1', title: 'Collected TT-001', info: 'Collected by Ram Kumar at 10:30 AM. Weight: 4.5kg' },
  { id: 2, lat: 28.6200, lng: 77.2200, type: 'facility', title: 'GreenProcessing Plant', info: 'Main recycling facility. Current capacity: 85%' },
  { id: 3, lat: 28.6000, lng: 77.2000, type: 'anomaly', ward: 'W2', title: 'Anomaly TT-005', info: 'Weight mismatch reported by Amit Singh. Source: 8kg | Collected: 5kg' },
  { id: 4, lat: 28.6300, lng: 77.2100, type: 'collection', ward: 'W1', title: 'Collected TT-012', info: 'Collected by Priya Das at 11:15 AM. Weight: 2.1kg' },
];

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredMarkers = DUMMY_MARKERS.filter(m => {
    if (activeFilter === 'all') return true;
    return m.type === activeFilter;
  }).map(m => ({
    ...m,
    popup: (
      <div>
        <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">{m.title}</h3>
        <p className="text-sm text-slate-600 leading-tight">{m.info}</p>
        {m.ward && <span className="mt-2 inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold border border-slate-200 shadow-sm">Ward {m.ward}</span>}
      </div>
    )
  }));

  return (
    <div className="flex flex-col h-[calc(100vh)] lg:flex-row bg-[#050505] relative overflow-hidden">
      
      {/* Sidebar Panel - Cyber Deck */}
      <div className="w-full lg:w-[400px] glass bg-white/[0.02] border-r border-white/10 flex flex-col h-1/2 lg:h-full z-10 shadow-2xl relative order-2 lg:order-1">
        <div className="p-8 border-b border-white/[0.05] bg-white/[0.02]">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase group flex items-center gap-3">
            Live Tracker
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Real-Time Geospatial Intelligence</p>
        </div>

        <div className="p-8 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 mb-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <Filter className="h-4 w-4 text-indigo-500/50" /> Signal Filters
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'all' ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg glow-indigo' : 'glass bg-white/[0.03] text-gray-500 border-white/[0.08] hover:bg-white/5 hover:text-gray-300'}`}
            >
              All Signals
            </button>
            <button 
              onClick={() => setActiveFilter('collection')}
              className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeFilter === 'collection' ? 'glass-emerald bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'glass bg-white/[0.03] text-gray-500 border-white/[0.08] hover:bg-white/5 hover:text-gray-300'}`}
            >
              <Package className="h-3 w-3" /> Nodes
            </button>
            <button 
              onClick={() => setActiveFilter('facility')}
              className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeFilter === 'facility' ? 'glass-blue bg-blue-500/10 text-blue-400 border-blue-500/30' : 'glass bg-white/[0.03] text-gray-500 border-white/[0.08] hover:bg-white/5 hover:text-gray-300'}`}
            >
              <Building2 className="h-3 w-3" /> Assets
            </button>
            <button 
              onClick={() => setActiveFilter('anomaly')}
              className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeFilter === 'anomaly' ? 'glass-red bg-red-500/10 text-red-400 border-red-500/30' : 'glass bg-white/[0.03] text-gray-500 border-white/[0.08] hover:bg-white/5 hover:text-gray-300'}`}
            >
              <AlertTriangle className="h-3 w-3" /> Alerts
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-black/20 hide-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Active Uplinks ({filteredMarkers.length})</h3>
            <div className="h-px flex-1 bg-white/[0.05] ml-4"></div>
          </div>
          
          {filteredMarkers.map(m => (
             <div key={m.id} className="glass bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer group premium-shadow">
               <div className="flex justify-between items-start mb-3">
                 <h4 className="font-black text-sm text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${m.type === 'collection' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : m.type === 'anomaly' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></span>
                    {m.title}
                 </h4>
               </div>
               <p className="text-[10px] text-gray-500 font-bold leading-relaxed border-l border-white/10 pl-3 group-hover:border-indigo-500/30 transition-colors">{m.info}</p>
             </div>
          ))}
        </div>

        {/* System Status Footer */}
        <div className="p-6 bg-black/40 border-t border-white/[0.05] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Network Secure</span>
           </div>
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">v2.0.6-STABLE</span>
        </div>
      </div>

      {/* Map Environment */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full p-4 lg:p-10 bg-[#050505] order-1 lg:order-2 flex flex-col relative">
        <div className="absolute top-10 right-10 z-50 pointer-events-none opacity-20">
           <div className="text-[10px] font-black text-white uppercase tracking-[1em] rotate-90 origin-right"> TrashTrail Navigation System </div>
        </div>
        <div className="flex-1 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
          <MapView markers={filteredMarkers} />
          <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none rounded-[40px] z-[999]"></div>
        </div>
      </div>
    </div>
  );
}
