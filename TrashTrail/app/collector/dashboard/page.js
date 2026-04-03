'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Package, Scale, Star, AlertTriangle, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function CollectorDashboard() {
  const { data: session } = useSession();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('/api/waste');
        const myPickups = res.data.wasteBags?.filter(b => b.collectorId === session?.user?.id) || [];
        setPickups(myPickups);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.id) {
      fetchPickups();
    }
  }, [session]);

  const todayStr = new Date().toDateString();
  const todaysPickups = pickups.filter(p => new Date(p.updatedAt).toDateString() === todayStr);
  const totalWeightToday = todaysPickups.reduce((sum, p) => sum + (p.weightAtCollection || 0), 0);
  const anomaliesCount = todaysPickups.filter(p => p.anomalyFlag).length;

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Collector Dashboard</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Operational Node: Alpha / Authenticated</p>
        </div>
        <div className="flex items-center gap-3 glass-amber px-4 py-2 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Collector Live</span>
        </div>
      </div>
      
      {/* Quick Action */}
      <div className="group">
        <Link 
          href="/collector/scan" 
          className="flex flex-col sm:flex-row items-center justify-between gap-6 glass-amber bg-amber-500/10 p-8 rounded-3xl border border-amber-500/30 hover:glow-amber transition-all duration-500 premium-shadow group-hover:scale-[1.01]"
        >
          <div className="flex items-center gap-6">
            <div className="bg-amber-500 h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform duration-500">
              <Package className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-2xl text-white uppercase tracking-tight">Initiate Acquisition</h3>
              <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Activate Optical Sensor for QR Decryption</p>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full border border-amber-500/30 flex items-center justify-center group-hover:translate-x-2 transition-all">
            <ArrowRight className="h-6 w-6 text-amber-500" />
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass p-6 group hover:border-amber-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Today's Logs</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{loading ? '-' : todaysPickups.length}</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mass Captured</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{loading ? '-' : totalWeightToday.toFixed(1)} <span className="text-sm text-gray-400">KG</span></p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-indigo-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Star className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">92%</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-red-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Integrity Issues</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{loading ? '-' : anomaliesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Pickups */}
      <div className="glass rounded-2xl overflow-hidden premium-shadow">
        <div className="px-8 py-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Daily Data Stream</h2>
          <Link href="/collector/pickups" className="text-[10px] font-black text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-[0.3em] px-4 py-2 rounded-lg glass-amber border border-amber-500/20">
            Historical Registry →
          </Link>
        </div>
        
        {loading ? (
          <div className="p-16 text-center text-gray-500 font-bold uppercase tracking-widest">Synchronizing Logs...</div>
        ) : todaysPickups.length === 0 ? (
          <div className="p-16 text-center bg-black/20">
            <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/5">
              <Package className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No Node Acquisitions Today</p>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-2">Standing by for scanning activity</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {todaysPickups.slice(0, 5).map(pickup => (
              <div key={pickup._id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${pickup.anomalyFlag ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {pickup.anomalyFlag ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white font-mono tracking-widest group-hover:text-amber-400 transition-colors">{pickup.qrCode}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5 capitalize">{pickup.wasteType}</span>
                      <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">{pickup.weightAtCollection} KG</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {new Date(pickup.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
