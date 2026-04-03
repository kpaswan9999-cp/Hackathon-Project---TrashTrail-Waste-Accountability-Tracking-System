'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, Users, AlertTriangle, Recycle, ChevronRight, Truck, QrCode, X } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';

// DUMMY DATA mapping specifications outlined
const MOCK_DATA = {
  stats: {
    totalWasteToday: 5200,
    recyclingRate: 72,
    activeCollectors: 24,
    anomaliesToday: 3,
    activeCitizens: 1250,
    openComplaints: 8
  },
  dailyCollection: [
    { name: 'Mon', weight: 4000 },
    { name: 'Tue', weight: 4200 },
    { name: 'Wed', weight: 4800 },
    { name: 'Thu', weight: 5100 },
    { name: 'Fri', weight: 4900 },
    { name: 'Sat', weight: 5500 },
    { name: 'Sun', weight: 5200 },
  ],
  wasteTypes: [
    { name: 'Dry Waste', value: 45, color: '#3b82f6' },
    { name: 'Wet Waste', value: 35, color: '#10b981' },
    { name: 'Hazardous', value: 10, color: '#ef4444' },
    { name: 'Mixed', value: 10, color: '#64748b' },
  ],
  wardCollection: [
    { ward: 'W1', weight: 1200 },
    { ward: 'W2', weight: 1800 },
    { ward: 'W3', weight: 900 },
    { ward: 'W4', weight: 2100 },
    { ward: 'W5', weight: 1500 },
  ],
  recentActivity: [
    { id: 1, text: "Bag TT-00123 recycled at Green Plant", time: "2 min ago", icon: Recycle, color: "text-emerald-500 bg-emerald-100 ring-emerald-50" },
    { id: 2, text: "Weight mismatch detected — Bag TT-00456", time: "15 min ago", icon: AlertTriangle, color: "text-red-500 bg-red-100 ring-red-50" },
    { id: 3, text: "New complaint from Ward 5", time: "30 min ago", icon: AlertTriangle, color: "text-amber-500 bg-amber-100 ring-amber-50" },
    { id: 4, text: "45 bags collected by Ram Kumar", time: "1 hr ago", icon: Package, color: "text-blue-500 bg-blue-100 ring-blue-50" },
  ],
  topCollectors: [
    { id: 1, name: "Ram Kumar", pickups: 145, score: 98 },
    { id: 2, name: "Amit Singh", pickups: 132, score: 95 },
    { id: 3, name: "Priya Das", pickups: 128, score: 92 },
  ]
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, wasteRes] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/waste')
      ]);
      
      const json = analyticsRes.data;
      const allBags = wasteRes.data.wasteBags || [];
      
      const mappedActivity = json.recentActivity.map(act => {
        let Icon = Package;
        let color = "text-blue-500 bg-blue-100 ring-blue-50";
        if (act.type === 'recycle') { Icon = Recycle; color = "text-emerald-500 bg-emerald-100 ring-emerald-50"; }
        else if (act.type === 'transit') { Icon = Truck; color = "text-amber-500 bg-amber-100 ring-amber-50"; }
        else if (act.type === 'anomaly') { Icon = AlertTriangle; color = "text-red-500 bg-red-100 ring-red-50"; }
        return { ...act, icon: Icon, colorClass: color };
      });

      setData({ ...json, recentActivity: mappedActivity, allWasteBags: allBags });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateWasteStatus = async (id, status, note) => {
    try {
      await axios.put(`/api/waste/${id}`, { status, note });
      fetchData(); // Refresh all data
    } catch (err) {
      console.error('Update Error:', err);
      alert('Failed to update node status');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 inline-block">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
        <p className="font-medium mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Retry</button>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Authority Dashboard</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            Real-Time Municipal Data Stream Alpha-9
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse outline outline-4 outline-emerald-500/20"></div>
            <span className="text-white text-[10px] font-black uppercase tracking-widest leading-none">System Healthy</span>
          </div>
          <button className="glass-indigo px-6 py-3 rounded-2xl border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:glow-indigo transition-all">
            Secure Export
          </button>
        </div>
      </div>

      {/* SECTION 1: STATS - HIGH IMPACT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Aggregated Waste" value={data.stats.totalWasteToday.toLocaleString()} subtitle="kg" icon={Package} trend="12%" trendUp={true} color="blue" />
        <StatsCard title="Recycling Yield" value={`${data.stats.recyclingRate}%`} icon={Recycle} trend="4%" trendUp={true} color="emerald" />
        <StatsCard title="Active Units" value={data.stats.activeCollectors} icon={Users} color="indigo" />
        <StatsCard title="System Anomalies" value={data.stats.anomaliesToday} icon={AlertTriangle} trend="2%" trendUp={false} color="red" />
      </div>

      {/* SECTION 2 & 3: ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/[0.05] premium-shadow relative group">
          <div className="flex items-center justify-between mb-8 border-b border-white/[0.05] pb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Temporal Flow Analysis</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded-full border border-indigo-500/20 uppercase">Real-time</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyCollection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeightAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 900}} dx={-15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: '#fff' }} 
                  itemStyle={{ color: '#818cf8', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorWeightAdmin)" activeDot={{r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 3}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/[0.05] flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-black text-white mb-8 border-b border-white/[0.05] pb-6 uppercase tracking-tight">Material Allocation</h2>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.wasteTypes}
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.wasteTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} style={{filter: 'drop-shadow(0px 0px 10px rgba(99,102,241,0.2))'}} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                   itemStyle={{fontWeight: '900', fontSize: '10px', textTransform: 'uppercase'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white tracking-widest drop-shadow-2xl">FULL</span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Classification</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-8">
            {data.wasteTypes.map(type => (
              <div key={type.name} className="flex items-center gap-2 group">
                <span className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform" style={{ backgroundColor: type.color }}></span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: LIVE FEED & SPATIAL DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl border border-white/[0.05] premium-shadow">
          <h2 className="text-lg font-black text-white mb-8 border-b border-white/[0.05] pb-6 uppercase tracking-tight">District Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.wardCollection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="ward" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 900}} dy={15} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="weight" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/[0.05] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/5">
          <div className="px-8 py-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Live Command Log</h2>
            <div className="flex h-4 w-12 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div className="p-8 flex-1 overflow-y-auto max-h-[256px] space-y-6">
            {data.recentActivity.map((act, i) => (
              <div key={act.id} className="flex gap-5 relative group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 glass border white/[0.05] group-hover:scale-110 transition-transform duration-300`}>
                  <act.icon className={`w-5 h-5 ${act.type === 'bag' ? 'text-indigo-400' : 'text-red-400'}`} />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-2 pt-1 border-b border-white/[0.03] pb-4">
                  <p className="text-[11px] font-black text-white/90 uppercase tracking-wide leading-relaxed">{act.text}</p>
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5 whitespace-nowrap">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: PROCESSING CENTER */}
      <div className="glass rounded-3xl border border-white/[0.05] overflow-hidden premium-shadow">
        <div className="px-8 py-6 border-b border-white/[0.05] bg-white/[0.01] flex justify-between items-center relative overflow-hidden">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Facility Processing Center</h2>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20 px-3 py-1 rounded-lg bg-emerald-500/10 shadow-lg glow-emerald">Operations Live</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Node Identifier</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Material</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Acquisition Mass</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Current State</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {data.allWasteBags?.filter(b => ['collected', 'in_transit', 'at_facility', 'processed'].includes(b.status)).length > 0 ? (
                data.allWasteBags.filter(b => ['collected', 'in_transit', 'at_facility', 'processed'].includes(b.status)).map(bag => (
                  <tr key={bag._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white font-mono tracking-widest uppercase group-hover:text-indigo-400 transition-colors">{bag.qrCode}</p>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">NODE AUTH: {bag._id.slice(-8)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5 capitalize">{bag.wasteType}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-white tracking-widest">
                      {bag.weightAtCollection || bag.weightAtSource} <span className="text-[9px] text-gray-500 font-bold uppercase">KG</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border shadow-lg ${
                        bag.status === 'collected' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        bag.status === 'at_facility' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 glow-orange' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald'
                      }`}>
                        {bag.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        {bag.status !== 'processed' ? (
                          <button 
                            onClick={() => updateWasteStatus(bag._id, 'processed', 'Material decentralized and ready for reclamation')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:glow-indigo transition-all active:scale-95 flex items-center gap-2"
                          >
                            Process Material <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateWasteStatus(bag._id, 'recycled', 'Node successfully converted to raw sustainable materials')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:glow-emerald transition-all active:scale-95 flex items-center gap-2"
                          >
                            <Recycle className="w-3 h-3" /> Finalize Recycle
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Package className="w-12 h-12 text-gray-500" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">No nodes pending processing in facility queue</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* SECTION 6: MATERIALS RECOVERY LEDGER */}
      <div className="glass rounded-3xl border border-emerald-500/10 overflow-hidden premium-shadow mt-10 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none"></div>
        <div className="px-8 py-6 border-b border-emerald-500/10 bg-emerald-500/[0.02] flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Recycle className="w-5 h-5 text-emerald-400 animate-spin-slow" />
              Materials Recovery Ledger
            </h2>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 italic">Verified Circular Economy Handshakes</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[14px] font-black text-white">{data.allWasteBags?.filter(b => b.status === 'recycled').length} NODES</span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest uppercase mt-0.5">Final Sequestration</span>
          </div>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-500/[0.03]">
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Node Identifier</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Material Yield</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Carbon Offset</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Final Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/5">
              {data.allWasteBags?.filter(b => b.status === 'recycled').length > 0 ? (
                data.allWasteBags.filter(b => b.status === 'recycled').slice(0, 5).map(bag => (
                  <tr key={bag._id} className="hover:bg-emerald-500/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                         <p className="text-sm font-black text-white font-mono tracking-widest uppercase group-hover:text-emerald-400 transition-colors">{bag.qrCode}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white">{bag.weightAtCollection || bag.weightAtSource} KG</p>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Post-Processing Mass</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-emerald-400 tracking-widest">
                      +{( (bag.weightAtCollection || bag.weightAtSource || 0) * 0.5).toFixed(1)} KG CO2e
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                           <span className="text-[10px]">🛡️</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest uppercase italic border-b border-white/5 text-gray-500">System Verified</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="4" className="px-8 py-16 text-center opacity-20">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Awaiting lifecycle completion for node sequestration</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
          {data.allWasteBags?.filter(b => b.status === 'recycled').length > 5 && (
            <div className="px-8 py-4 bg-emerald-500/[0.02] text-center border-t border-emerald-500/5">
              <button className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors uppercase italic">View 24+ archived ledger entries →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
