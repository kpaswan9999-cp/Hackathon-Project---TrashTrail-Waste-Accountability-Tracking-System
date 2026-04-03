'use client';

import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import WasteTimeline from '@/components/WasteTimeline';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');
  
  const [wasteBags, setWasteBags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(initialId);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const res = await axios.get('/api/waste');
        setWasteBags(res.data.wasteBags || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBags();
  }, []);

  const filteredBags = wasteBags.filter(b => 
    b.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const maps = {
      created: { text: 'Created', color: 'bg-slate-100 text-slate-800 border-slate-200' },
      collected: { text: 'Collected', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      in_transit: { text: 'In Transit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      at_facility: { text: 'At Facility', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      processed: { text: 'Processed', color: 'bg-green-100 text-green-800 border-green-200' },
      recycled: { text: 'Recycled', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    };
    const mapped = maps[status] || maps.created;
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border shadow-sm ${mapped.color}`}>{mapped.text}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fadeInUp pb-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Waste Registry</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">End-to-End Lifecycle Synchronization</p>
      </div>
      
      <div className="relative mb-12 group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
          <Search className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full glass bg-white/[0.03] border border-white/[0.08] py-5 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] rounded-2xl font-black text-sm tracking-widest uppercase transition-all premium-shadow"
          placeholder="Enter QR Identifier, Material Type, or Node Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border border-white/5">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-6" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Querying Distributed Ledger...</p>
        </div>
      ) : filteredBags.length === 0 ? (
        <div className="text-center p-20 glass rounded-3xl border border-white/[0.05]">
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/5 text-gray-700">
            <Search className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No Records Found</p>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-2">Modify search parameters and re-initialize query</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBags.map((bag) => (
            <div key={bag._id} className="glass rounded-2xl border border-white/[0.05] overflow-hidden transition-all hover:border-emerald-500/30 group premium-shadow">
              <div 
                className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10"
                onClick={() => setExpandedId(expandedId === bag._id ? null : bag._id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-2xl font-black text-white tracking-widest group-hover:text-emerald-400 transition-colors uppercase">{bag.qrCode}</span>
                    <span className="px-3 py-1 bg-white/5 text-gray-400 font-black text-[9px] rounded border border-white/10 uppercase tracking-widest">
                      {bag.wasteType}
                    </span>
                  </div>
                  <div className="text-[10px] font-black text-gray-500 flex items-center gap-3 uppercase tracking-widest">
                    <span className="text-emerald-500/60">{bag.weightAtSource} KG</span>
                    <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                    <span>Created: {new Date(bag.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-auto w-full">
                  <div className="transform group-hover:scale-110 transition-transform">
                    {getStatusBadge(bag.status)}
                  </div>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/5 transition-all duration-500 ${expandedId === bag._id ? 'rotate-180 border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {expandedId === bag._id && (
                <div className="px-6 pb-10 sm:px-10 sm:pb-12 pt-4 border-t border-white/[0.05] bg-black/20 animate-fadeInUp">
                  
                  {/* Journey Progress Bar */}
                  <div className="mb-12 mt-4 px-2">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Journey Completion</p>
                        <h4 className="text-2xl font-black text-white uppercase italic">
                          {bag.status === 'recycled' ? '100% CIRCULAR' : 
                           bag.status === 'processed' ? '85% RECLAIMED' :
                           bag.status === 'at_facility' ? '60% ARRIVED' :
                           bag.status === 'in_transit' ? '40% MOVING' :
                           bag.status === 'collected' ? '20% ACQUIRED' : '5% PENDING'}
                        </h4>
                      </div>
                      {bag.status === 'recycled' && (
                        <div className="flex items-center gap-2 glass-emerald px-4 py-2 rounded-xl border border-emerald-500/30 animate-pulse transition-all">
                          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">CO2 OFFSET VERIFIED</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-4 p-1 border border-white/10 relative overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
                          bag.status === 'recycled' ? 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${
                          bag.status === 'recycled' ? 100 : 
                          bag.status === 'processed' ? 85 :
                          bag.status === 'at_facility' ? 60 :
                          bag.status === 'in_transit' ? 40 :
                          bag.status === 'collected' ? 20 : 5
                        }%` }}
                      ></div>
                      {bag.status === 'recycled' && (
                        <div className="absolute inset-0 bg-emerald-400/20 blur-sm pointer-events-none"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-10 pt-4">
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                     <h3 className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] whitespace-nowrap">Immutable Node Trajectory</h3>
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
                  </div>
                  <div className="px-2">
                    <WasteTimeline timeline={bag.timeline} currentStatus={bag.status} />
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

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600"/></div>}>
      <TrackContent />
    </Suspense>
  )
}
