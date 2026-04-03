'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Leaf, Recycle, Car, Package } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function CitizenDashboard() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [wasteBags, setWasteBags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bagsRes, userRes] = await Promise.all([
          axios.get('/api/waste'),
          axios.get('/api/users/profile')
        ]);
        setWasteBags(bagsRes.data.wasteBags || []);
        setUser(userRes.data.user);
      } catch (err) {
        console.error('Fetch Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    greenScore: user?.greenScore || 0,
    totalRecycled: user?.totalWasteRecycled || 0,
    carbonSaved: user?.carbonSaved || 0,
  };

  const activeBags = wasteBags.filter(b => b.status !== 'recycled' && b.status !== 'processed').length;

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Citizen Dashboard</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-1">Node Status: Active / Authenticated</p>
        </div>
        <div className="flex items-center gap-3 glass-emerald px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Network Live</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass p-6 group hover:border-emerald-500/30 transition-all duration-500 hover:glow-emerald">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🌿</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Green Score</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{stats.greenScore} pts</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-indigo-500/30 transition-all duration-500 hover:glow-indigo">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-3xl">♻️</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Recycled</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{stats.totalRecycled} kg</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-cyan-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Carbon Neutral</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{stats.carbonSaved} kg</p>
            </div>
          </div>
        </div>

        <div className="glass p-6 group hover:border-amber-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📦</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Nodes</p>
              <p className="text-2xl font-black text-white mt-1 uppercase tracking-tight">{activeBags}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Impact Section */}
      <div className="glass-emerald rounded-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors"></div>
        
        <h2 className="text-xl font-black text-emerald-400 mb-6 flex items-center gap-3 uppercase tracking-widest">
          <Leaf className="h-6 w-6" /> Ecological Impact Factor
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="glass bg-black/20 p-6 rounded-xl border border-white/5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Offset Equivalence</p>
            <p className="text-2xl font-black text-white uppercase mt-2">🌳 5 Mature Trees</p>
            <p className="text-emerald-500/60 text-[10px] mt-2 font-bold uppercase tracking-widest">Biosphere Protection Point Alpha</p>
          </div>
          <div className="glass bg-black/20 p-6 rounded-xl border border-white/5">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Prevented Emissions</p>
            <p className="text-2xl font-black text-white uppercase mt-2">🚗 25 KM Journey</p>
            <p className="text-emerald-500/60 text-[10px] mt-2 font-bold uppercase tracking-widest">Atmospheric Stability Index Beta</p>
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-[0.2em] block mb-1">System Efficiency Goal</span>
              <span className="text-2xl font-black text-emerald-900">85% OPTIMIZED</span>
            </div>
            <span className="text-emerald-900/40 font-black text-sm uppercase">15kg Remaining until Phase 2</span>
          </div>
          <div className="w-full bg-emerald-900/20 rounded-full h-3 p-0.5 border border-emerald-500/20">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Waste Bags */}
      <div className="glass rounded-2xl overflow-hidden premium-shadow">
        <div className="px-8 py-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Waste Nodes</h2>
          <Link href="/citizen/track" className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.3em] px-4 py-2 rounded-lg glass-emerald border border-emerald-500/20">
            Access Full Registry →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest">Initializing Data Stream...</div>
          ) : wasteBags.length === 0 ? (
            <div className="p-12 text-center bg-black/20">
              <p className="text-gray-500 font-bold uppercase tracking-widest mb-6">No Data Nodes Found In Local Memory</p>
              <Link href="/citizen/generate-qr" className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm active:scale-95">
                Generate Primary QR
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Node Identifier</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Flow Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {wasteBags.slice(0, 5).map((bag) => (
                  <tr key={bag._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-white group-hover:text-emerald-400 transition-colors">{bag.qrCode}</td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/5 capitalize">{bag.wasteType}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest
                        ${bag.status === 'created' ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20' : 
                          bag.status === 'collected' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          bag.status === 'recycled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}
                      >
                        {bag.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {new Date(bag.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <Link href={`/citizen/track?id=${bag._id}`} className="text-emerald-400 hover:text-emerald-300 font-black text-[10px] uppercase tracking-widest border-b border-emerald-500/20 pb-0.5">
                        Trace Node
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
