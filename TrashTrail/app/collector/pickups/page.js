'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Package, MapPin, AlertTriangle, Loader2, CheckCircle, Truck, Building2 } from 'lucide-react';

export default function PickupsPage() {
  const { data: session } = useSession();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/waste');
      const myPickups = res.data.wasteBags?.filter(b => b.collectorId === session?.user?.id) || [];
      setPickups(myPickups.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPickups();
    }
  }, [session]);

  const updateStatus = async (id, status, note) => {
    try {
      await axios.put(`/api/waste/${id}`, { status, note });
      // Refresh the list
      fetchPickups();
    } catch (err) {
      console.error('Update Status Error:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const now = new Date();
  const filteredPickups = pickups.filter(p => {
    const d = new Date(p.updatedAt);
    if (filter === 'today') {
      return d.toDateString() === now.toDateString();
    }
    if (filter === 'week') {
      const diffTime = Math.abs(now - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 7;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fadeInUp pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Pickup Archives</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Historical Node Acquisition Registry</p>
        </div>
        
        <div className="flex p-1 glass bg-white/[0.03] border border-white/[0.08] rounded-xl self-start">
          {['today', 'week', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                filter === f ? 'bg-amber-500 text-white shadow-lg glow-amber' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {f === 'week' ? 'Past 7D' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-white/5">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mb-6" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Querying Archive Ledger...</p>
        </div>
      ) : filteredPickups.length === 0 ? (
        <div className="text-center p-20 glass rounded-3xl border border-white/[0.05]">
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/5 text-gray-700">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Registry Empty</p>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-2">No data captured for selected temporal range</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPickups.map((bag) => (
            <div key={bag._id} className="glass rounded-2xl border border-white/[0.05] overflow-hidden hover:border-amber-500/30 group transition-all premium-shadow relative">
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                bag.status === 'collected' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                bag.status === 'in_transit' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                bag.status === 'at_facility' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              }`}></div>

              <div className="p-6 sm:p-8 pl-8 sm:pl-10 relative z-10 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-500 group-hover:scale-110 ${
                      bag.anomalyFlag ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg glow-red' : 
                      bag.status === 'collected' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-lg glow-blue' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-lg glow-amber'
                    }`}>
                      {bag.anomalyFlag ? <AlertTriangle className="h-7 w-7" /> : <CheckCircle className="h-7 w-7" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-mono text-xl font-black tracking-widest text-white group-hover:text-amber-400 transition-colors uppercase">{bag.qrCode}</span>
                        <span className="px-3 py-1 bg-white/5 text-gray-400 font-black text-[9px] rounded border border-white/10 uppercase tracking-widest">
                          {bag.wasteType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-800"></span>
                          {new Date(bag.updatedAt).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}
                        </span>
                        <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                          <span className="text-gray-600 line-through decoration-red-500/30">{bag.weightAtSource}KG</span> 
                          <span className="text-emerald-400 font-black">→ {bag.weightAtCollection} KG</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col gap-4 sm:gap-3 sm:items-end w-full sm:w-auto justify-between sm:justify-start">
                    <span className={`inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                      bag.status === 'collected' ? 'glass-blue bg-blue-500/10 text-blue-400 border-blue-500/30 glow-blue' : 
                      bag.status === 'in_transit' ? 'glass-amber bg-amber-500/10 text-amber-400 border-amber-500/30 glow-amber' : 
                      'glass-emerald bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald'
                    }`}>
                      {bag.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Logistics Controls */}
                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                  {bag.status === 'collected' && (
                    <button
                      onClick={() => updateStatus(bag._id, 'in_transit', 'Waste bag dispatched for transit')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-400 font-black text-[10px] rounded-xl border border-amber-500/20 transition-all uppercase tracking-widest active:scale-95 shadow-lg hover:glow-amber group/btn"
                    >
                      <Truck className="w-4 h-4 group-hover/btn:animate-bounce" />
                      Mark In Transit
                    </button>
                  )}
                  {bag.status === 'in_transit' && (
                    <button
                      onClick={() => updateStatus(bag._id, 'at_facility', 'Waste bag received at recycling facility scale')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-400 font-black text-[10px] rounded-xl border border-orange-500/20 transition-all uppercase tracking-widest active:scale-95 shadow-lg hover:glow-orange group/btn"
                    >
                      <Building2 className="w-4 h-4 group-hover/btn:scale-110" />
                      Confirm Facility Arrival
                    </button>
                  )}
                  <div className="flex-1"></div>
                  {bag.timeline.find(t=>t.status === 'collected')?.location && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">GPS Authenticated Node</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Anomaly Banner */}
              {bag.anomalyFlag && (
                <div className="bg-red-500/10 px-8 py-4 border-t border-red-500/20 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-relaxed">
                      Integrity Warning: {bag.anomalyReason || 'Anomaly detected during node acquisition.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
