import { Package, Truck, Navigation, Building2, Cog, Recycle } from 'lucide-react';

export default function WasteTimeline({ timeline = [], currentStatus }) {
  const allStatuses = ["created", "collected", "in_transit", "at_facility", "processed", "recycled"];
  
  const getIcon = (status) => {
    switch(status) {
      case 'created': return Package;
      case 'collected': return Truck;
      case 'in_transit': return Navigation;
      case 'at_facility': return Building2;
      case 'processed': return Cog;
      case 'recycled': return Recycle;
      default: return Package;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'created': return 'text-slate-400';
      case 'collected': return 'text-blue-400';
      case 'in_transit': return 'text-amber-400';
      case 'at_facility': return 'text-orange-400';
      case 'processed': return 'text-emerald-400';
      case 'recycled': return 'text-emerald-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIndex = (status) => allStatuses.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="flex flex-col space-y-0 py-4">
      {allStatuses.map((statusItem, idx) => {
        const IconNode = getIcon(statusItem);
        const timelineEntry = timeline.find(t => t.status === statusItem);
        
        const isCompleted = !!timelineEntry;
        const isCurrent = statusItem === currentStatus;
        const isFuture = !isCompleted && !isCurrent;
        
        const delayClass = `delay-${(idx + 1) * 100}`;
        const isLastItem = idx === allStatuses.length - 1;

        return (
          <div key={statusItem} className={`flex ${isCompleted ? `animate-fadeInUp ${delayClass}` : ''} group`}>
            {/* Left Column: Flow Indicators */}
            <div className="flex flex-col items-center mr-6">
              {idx === 0 ? <div className="h-6 w-0.5 transparent" /> : null}

              <div className="relative flex items-center justify-center p-2">
                {isCompleted && !isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 animate-pulse ring-8 ring-emerald-500/20 glow-emerald z-10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                )}

                {isFuture && (
                  <div className="w-4 h-4 rounded-full bg-white/5 border-2 border-white/10 z-10"></div>
                )}
              </div>

              {!isLastItem && (
                 <div className={`w-0.5 flex-1 min-h-[5rem] my-1 rounded-full transition-all duration-1000 ${isCompleted && !isCurrent ? 'bg-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : isCurrent ? 'bg-gradient-to-b from-emerald-500/60 to-white/5' : 'bg-white/5'}`}></div>
              )}
            </div>

            {/* Right Column: Node Details */}
            <div className={`flex-1 pb-10 ${idx === 0 ? 'pt-2' : ''}`}>
               {(isCompleted || isCurrent) ? (
                 <div className={`glass rounded-2xl p-6 border transition-all duration-500 ${isCurrent ? 'border-emerald-500/30 bg-emerald-500/[0.03] shadow-lg glow-emerald scale-[1.02]' : 'border-white/[0.03] flex-shrink-0 opacity-80'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${isCurrent ? 'bg-emerald-500/20 border-emerald-500/30 shadow-lg glow-emerald' : 'bg-white/5 border-white/10'}`}>
                          <IconNode className={`w-5 h-5 ${getStatusColor(statusItem)}`} />
                        </div>
                        <div>
                          <h4 className={`font-black capitalize text-lg tracking-tight ${isCurrent ? 'text-white' : 'text-gray-400'} uppercase italic`}>
                            {statusItem.replace('_', ' ')}
                          </h4>
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-0.5">Verified Lifecycle Node</p>
                        </div>
                      </div>
                      {timelineEntry?.timestamp && (
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            {new Date(timelineEntry.timestamp).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {timelineEntry?.note && (
                      <div className="bg-white/[0.01] border-l-2 border-emerald-500/30 pl-4 py-2 mt-2">
                        <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic uppercase tracking-wide">
                          "{timelineEntry.note}"
                        </p>
                      </div>
                    )}
                    
                    {timelineEntry?.location?.lat && (
                      <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-white/5 rounded-lg border border-white/5 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">
                          GEO-LOC: {timelineEntry.location.lat.toFixed(4)}°N, {timelineEntry.location.lng.toFixed(4)}°E
                        </span>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="h-full flex items-center pl-2 pt-1 opacity-20">
                    <span className="text-sm font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-4 italic grayscale">
                      <IconNode className="w-5 h-5" />
                      {statusItem.replace('_', ' ')}
                    </span>
                 </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
