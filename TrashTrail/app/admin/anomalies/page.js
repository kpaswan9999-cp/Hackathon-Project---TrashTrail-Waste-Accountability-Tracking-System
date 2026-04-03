'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AnomalyAlert from '@/components/AnomalyAlert';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await axios.get('/api/anomalies');
        setAnomalies(res.data.anomalies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAnomalies(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
  };

  const filteredAnomalies = anomalies.filter(a => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const activeAnomaliesCount = anomalies.filter(a => a.status !== 'resolved').length;

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fadeInUp pb-32 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-6">
            Integrity Console
            {activeAnomaliesCount > 0 && (
              <span className="bg-red-500/20 text-red-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-red-500/30 shadow-lg glow-red animate-pulse uppercase tracking-[0.2em]">
                {activeAnomaliesCount} Discrepancies Detected
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">AI-Augmented Anomaly Detection & Conflict Resolution</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 mb-10 hide-scrollbar px-1">
        {['all', 'weight_mismatch', 'missed_pickup', 'route_deviation'].map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all duration-300 ${
              filterType === f ? 'bg-red-500 text-white border-red-500 shadow-lg glow-red' : 'glass bg-white/[0.03] text-gray-500 border-white/[0.08] hover:bg-white/5 hover:text-gray-300'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-white/5">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-6" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Scanning Network Integrity...</p>
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="text-center p-20 glass rounded-3xl border border-white/[0.05] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-xl glow-emerald relative z-10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 uppercase relative z-10">System Optimal</h3>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">No integrity violations identified in the current sector</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredAnomalies.map(anomaly => (
            <AnomalyAlert key={anomaly._id} anomaly={anomaly} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
