export default function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'emerald' }) {
  
  const bgClass = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    red: 'bg-red-500/10 text-red-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }[color] || 'bg-emerald-500/10 text-emerald-400';

  const barClass = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
  }[color] || 'bg-emerald-500';

  return (
    <div className="glass-card p-6 glass-card-hover hover:-translate-y-1 relative overflow-hidden group">
      {/* Left colored bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-lg ${barClass} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="flex items-start justify-between pl-3 relative z-10 w-full">
        <div>
          <p className="text-sm font-bold text-gray-400 tracking-wider mb-2 uppercase">{title}</p>
          <h3 className="text-4xl font-black text-white">{value}</h3>
          
          {trend && (
            <p className={`text-sm font-bold mt-3 flex items-center gap-1.5 ${trendUp ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'} px-2 py-1 rounded inline-flex`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 ${bgClass} shadow-inner`}>
          {Icon && <Icon className="w-7 h-7" />}
        </div>
      </div>
      
      {/* Subtle background glow effect using color */}
      <div className={`absolute -bottom-10 -right-10 w-28 h-28 ${barClass} opacity-10 blur-[40px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity`}></div>
    </div>
  );
}
