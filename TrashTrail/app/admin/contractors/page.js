'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Phone, Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

// MOCK DATA for Contractors
const DUMMY_CONTRACTORS = [
  { id: 1, name: 'Ram Kumar', phone: '+91 9876543210', ward: 'Ward 1, Ward 2', totalPickups: 1450, todayPickups: 45, accuracy: 98, anomalies: 2, isActive: true },
  { id: 2, name: 'Amit Singh', phone: '+91 8765432109', ward: 'Ward 3', totalPickups: 980, todayPickups: 32, accuracy: 94, anomalies: 5, isActive: true },
  { id: 3, name: 'Priya Das', phone: '+91 7654321098', ward: 'Ward 4', totalPickups: 1240, todayPickups: 38, accuracy: 96, anomalies: 1, isActive: true },
  { id: 4, name: 'Raju Bhai', phone: '+91 6543210987', ward: 'Ward 5', totalPickups: 420, todayPickups: 12, accuracy: 85, anomalies: 12, isActive: false },
];

export default function ContractorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const calculateScore = (total, anomalies, accuracy) => {
    let score = (total * 0.05) - (anomalies * 5) + (accuracy * 0.8);
    return Math.min(Math.max(score, 0), 100).toFixed(0);
  };

  const filtered = DUMMY_CONTRACTORS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.ward.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto py-10 animate-fadeInUp pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Personnel Registry</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Strategic Asset Management & KPI Tracking</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text"
            placeholder="Search Assets..."
            className="w-full glass bg-white/[0.03] border border-white/[0.08] py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-2xl shadow-indigo-500/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(c => {
          const score = calculateScore(c.totalPickups, c.anomalies, c.accuracy);
          return (
            <div key={c.id} className="glass rounded-3xl border border-white/[0.05] overflow-hidden hover:border-indigo-500/30 group transition-all duration-500 premium-shadow relative">
              {/* Dynamic Status Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${c.isActive ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-gray-800'}`}></div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl glass bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-xl group-hover:glow-indigo transition-all duration-500">
                      <span className="font-black text-2xl text-indigo-400">{c.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                      <p className="text-[9px] font-black text-gray-500 flex items-center gap-2 mt-1 uppercase tracking-widest">
                        <Phone className="h-3 w-3 text-indigo-500/50" /> {c.phone}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border shadow-lg transition-all ${
                    c.isActive ? 'glass-indigo bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-gray-600 border-white/5'
                  }`}>
                    {c.isActive ? 'Active' : 'Offline'}
                  </div>
                </div>

                <div className="glass bg-white/[0.03] px-5 py-3 rounded-xl border border-white/[0.05] text-gray-400 mb-8 flex items-center gap-3 group-hover:border-indigo-500/20 transition-colors">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Users className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest truncate">{c.ward}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass bg-black/20 p-5 rounded-2xl border border-white/[0.03] flex flex-col justify-center text-center group-hover:bg-indigo-500/5 transition-colors">
                    <p className="text-[8px] uppercase font-black text-gray-500 tracking-[0.3em] mb-2">Cycle Load</p>
                    <p className="text-2xl font-black text-white">{c.todayPickups}</p>
                  </div>
                  <div className="glass bg-black/20 p-5 rounded-2xl border border-white/[0.03] flex flex-col justify-center text-center group-hover:bg-indigo-500/5 transition-colors">
                    <p className="text-[8px] uppercase font-black text-gray-500 tracking-[0.3em] mb-2">Total Units</p>
                    <p className="text-2xl font-black text-white">{c.totalPickups.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-5 pt-6 border-t border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                       <Target className="w-4 h-4 text-indigo-500/50" /> Accuracy Rating
                    </span>
                    <span className="text-xs font-black text-white font-mono tracking-tighter">{c.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                       <AlertTriangle className="w-4 h-4 text-red-500/50" /> Integrity Flags
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${c.anomalies > 5 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/5'}`}>{c.anomalies}</span>
                  </div>
                </div>

                <div className="mt-10 p-5 glass bg-black/40 rounded-2xl flex justify-between items-center border border-white/[0.03] shadow-inner group-hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                       <ShieldCheck className="h-5 w-5 text-amber-500" /> 
                    </div>
                    <span className="text-[8px] font-black uppercase text-gray-500 tracking-[0.3em]">Operational Index</span>
                  </div>
                  <div className={`text-4xl font-black tracking-tighter ${score > 90 ? 'text-indigo-400' : score > 70 ? 'text-amber-400' : 'text-red-400'}`}>
                    {score}<span className="text-[10px] text-gray-500 not-italic ml-1">/100</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
