import { AlertTriangle, Clock, MapPin, UserSquare2, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function AnomalyAlert({ anomaly, onStatusChange }) {
  const isResolved = anomaly.status === 'resolved';
  const isInvestigating = anomaly.status === 'investigating';

  const severityStyles = {
    low: { border: 'border-l-4 border-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400', icon: 'text-yellow-500', glow: '' },
    medium: { border: 'border-l-4 border-orange-500', badge: 'bg-orange-500/20 text-orange-400', icon: 'text-orange-500', glow: '' },
    high: { border: 'border-l-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse-glow', badge: 'bg-red-500/20 text-red-500 animate-pulse', icon: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' }
  }[anomaly.severity] || { border: 'border-l-4 border-gray-500', badge: 'bg-gray-500/20 text-gray-400', icon: 'text-gray-500', glow: '' };

  const handleUpdate = async (status) => {
    try {
      await axios.put(`/api/anomalies`, { id: anomaly._id, status });
      onStatusChange && onStatusChange(anomaly._id, status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`glass rounded-3xl p-8 overflow-hidden transition-all duration-500 relative group hover:border-white/20 premium-shadow ${isResolved ? 'opacity-50 border-white/5' : severityStyles.border}`}>
      {/* Background Accent */}
      {!isResolved && (
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${anomaly.severity === 'high' ? 'from-red-500/10' : 'from-amber-500/10'} to-transparent blur-3xl rounded-full pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity`}></div>
      )}
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 relative z-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl border ${isResolved ? 'glass-emerald bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald' : severityStyles.badge}`}>
            {isResolved ? 'Resolved' : `${anomaly.severity} Priority`}
          </span>
          <span className="glass bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
            {anomaly.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-3 glass bg-black/40 px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5 text-indigo-500/50" /> 
          {new Date(anomaly.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>

      {/* Description Block */}
      <div className="mb-10 relative z-10">
        <div className="glass bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05] shadow-inner group-hover:bg-white/[0.04] transition-colors">
          <p className="text-sm font-bold text-gray-300 leading-relaxed">
            "{anomaly.description}"
          </p>
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pt-8 border-t border-white/[0.05] relative z-10">
        
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl glass bg-white/5 flex items-center justify-center border border-white/10 font-black text-gray-500 text-[10px] tracking-tighter group-hover:border-indigo-500/30 transition-colors uppercase">
              NODE
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Source Identifier</span>
              <span className="text-sm font-black text-white font-mono tracking-widest uppercase">{anomaly.wasteBag?.qrCode || 'NULL_PTR'}</span>
            </div>
          </div>
          
          <div className="hidden lg:block w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl glass bg-white/5 flex items-center justify-center border border-white/10 text-gray-500 group-hover:border-indigo-500/30 transition-colors">
               <UserSquare2 className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
             </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Assigned Operator</span>
              <span className="text-sm font-black text-gray-300 uppercase tracking-tight">{anomaly.collector?.name || 'STANDBY'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="flex gap-4 w-full lg:w-auto">
          {!isInvestigating && !isResolved && (
            <button 
              onClick={() => handleUpdate('investigating')}
              className="flex-1 lg:flex-none px-8 py-3 text-[10px] font-black uppercase tracking-widest text-amber-400 glass-amber bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all glow-amber shadow-xl"
            >
              Initialize Intelligence
            </button>
          )}
          {!isResolved && (
            <button 
              onClick={() => handleUpdate('resolved')}
              className="flex-1 lg:flex-none px-8 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 glass-emerald bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 glow-emerald transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-4 h-4" /> Finalize Mitigation
            </button>
          )}
          {isResolved && (
             <div className="flex-1 lg:flex-none px-8 py-3 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] glass-emerald bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-3">
               <ArrowRight className="h-4 w-4" /> Operational Sync Complete
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
