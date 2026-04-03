'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import QRScanner from '@/components/QRScanner';
import { Loader2, CheckCircle, AlertTriangle, MapPin, Scale } from 'lucide-react';

export default function ScanPage() {
  const { data: session } = useSession();
  const [scannedQR, setScannedQR] = useState(null);
  const [bagData, setBagData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState('');
  
  const [location, setLocation] = useState(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      }, () => {
        console.warn("Location permission denied");
      });
    }
  }, []);

  const handleScanSuccess = async (decodedText) => {
    let code = decodedText;
    
    if (!code.includes('TT-')) {
      setErrorString("Invalid QR format. Not a TrashTrail code.");
      return;
    }

    setScannedQR(code);
    fetchWasteBag(code);
  };

  const fetchWasteBag = async (code) => {
    setLoading(true);
    setErrorString('');
    const startTime = Date.now();
    try {
      const res = await axios.get(`/api/waste/${code}`);
      
      // Ensure "Deciphering" is visible for at least 1s for UX
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) await new Promise(r => setTimeout(r, 1000 - elapsed));
      
      const bag = res.data.wasteBag;
      if (bag.status === 'collected' || bag.status === 'processed' || bag.status === 'recycled' || bag.status === 'in_transit') {
        setErrorString(`This bag has already been scanned/collected. (Current Status: ${bag.status})`);
        setBagData(null);
      } else {
        setBagData(bag);
      }
    } catch (err) {
      setErrorString('Waste bag not found in system or invalid QR.');
      setBagData(null);
    } finally {
      setLoading(false);
    }
  };

  const submitPickup = async () => {
    if (!weight) {
      setErrorString('Please enter the actual weight collected.');
      return;
    }

    setLoading(true);
    setErrorString('');

    try {
      const payload = {
        status: 'collected',
        weight: Number(weight),
        note: notes || 'Picked up by collector',
        location: location
      };

      await axios.put(`/api/waste/${bagData._id}`, payload);
      setIsSuccess(true);
    } catch (err) {
      setErrorString('Failed to log pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedQR(null);
    setBagData(null);
    setIsSuccess(false);
    setWeight('');
    setNotes('');
    setErrorString('');
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-6 animate-fadeInUp">
        <div className="glass p-10 rounded-2xl text-center max-w-md w-full premium-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 mb-8 glow-amber">
            <CheckCircle className="h-12 w-12 text-amber-400" />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">Log Confirmed</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Node <span className="text-amber-400 font-mono">{bagData?.qrCode}</span> Synchronized</p>
          
          <div className="glass bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 mb-10 flex justify-around shadow-inner">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Final Mass</p>
              <p className="text-2xl font-black text-white tracking-tight">{weight} <span className="text-sm text-gray-400 font-bold">KG</span></p>
            </div>
            <div className="w-px bg-white/5"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Log Status</p>
              <p className="text-2xl font-black text-amber-400 tracking-tight uppercase">Captured</p>
            </div>
          </div>

          <button
            onClick={resetScanner}
            className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all uppercase tracking-[0.3em] text-sm active:scale-[0.98]"
          >
            Initiate Next Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 pb-32">
      <div className="text-center mb-10 px-6">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Optical Scanner</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Align QR Identifier for Local Data Acquisition</p>
      </div>

      <div className="page-stable px-4 sm:px-0">
        {!scannedQR ? (
          <div className="glass p-6 rounded-3xl premium-shadow relative group animate-fadeInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none rounded-3xl"></div>
            <div className="relative z-10 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
              <QRScanner onScanSuccess={handleScanSuccess} />
            </div>
            {errorString && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl text-center animate-pulse">
                {errorString}
              </div>
            )}
            <div className="mt-8 flex justify-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanner Ready</span>
               </div>
            </div>
          </div>
        ) : loading ? (
          <div className="glass p-20 rounded-3xl premium-shadow text-center flex flex-col items-center justify-center animate-fadeInUp min-h-[400px]">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
              <Loader2 className="h-16 w-16 animate-spin text-amber-400 relative z-10" />
            </div>
            <p className="text-white font-black uppercase tracking-[0.3em] text-sm mt-8">Deciphering Node Payload...</p>
            <p className="text-[10px] text-gray-500 font-mono mt-4 font-black bg-white/5 px-4 py-2 rounded-lg border border-white/5 tracking-wider">{scannedQR}</p>
          </div>
        ) : bagData ? (
          <div className="glass p-8 md:p-12 rounded-3xl premium-shadow relative overflow-hidden animate-fadeInUp">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full -mr-24 -mt-24"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Identification Link</p>
                <h2 className="text-3xl font-black font-mono text-white tracking-widest uppercase">{bagData.qrCode}</h2>
              </div>
              <span className="px-5 py-2 glass-amber bg-amber-500/10 text-amber-400 font-black text-[10px] rounded-lg uppercase tracking-widest border border-amber-500/20 glow-amber">
                {bagData.wasteType}
              </span>
            </div>

            <div className="glass bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-10 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-6">
                <div className="bg-amber-500/10 p-4 border border-amber-500/20 rounded-2xl shadow-lg glow-amber">
                  <Scale className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Citizen Reported Mass</p>
                  <p className="text-3xl font-black text-white tracking-tight">{bagData.weightAtSource || '0.0'} <span className="text-sm text-gray-500">KG</span></p>
                </div>
              </div>
            </div>

            {errorString && (
              <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl flex items-start gap-4 animate-pulse">
                <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                <p className="mt-0.5">{errorString}</p>
              </div>
            )}

            <div className="space-y-8 mb-12 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                  Verified Weight <span className="text-amber-500 font-black">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full pl-6 pr-4 py-5 bg-black/40 border-2 border-amber-500/30 rounded-2xl text-white placeholder-gray-800 focus:outline-none focus:border-amber-500 focus:bg-black/60 transition-all font-black text-4xl tracking-tight shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                    placeholder="0.0"
                    autoFocus
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-amber-500/40 text-sm uppercase tracking-widest">KILOGRAMS</div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                  Field Observations <span className="text-[10px] text-gray-600 ml-2">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                  placeholder="Log physical anomalies or condition..."
                />
              </div>
              
              <div className="flex items-center gap-3 text-[10px] font-black justify-center mt-6">
                <MapPin className={`h-4 w-4 ${location ? 'text-emerald-400' : 'text-gray-600'}`} />
                <span className={`uppercase tracking-widest ${location ? 'text-emerald-400' : 'text-gray-600'}`}>
                  {location ? 'Geo-Spatial Coordinates Locked' : 'GPS Acquisition Pending'}
                </span>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={resetScanner}
                disabled={loading}
                className="px-8 py-5 font-black text-gray-400 glass border border-white/5 hover:bg-white/10 hover:text-white rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Abort
              </button>
              <button
                onClick={submitPickup}
                disabled={loading || !weight}
                className="flex-1 flex justify-center items-center gap-3 px-8 py-5 font-black text-white bg-amber-500 hover:bg-amber-400 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 text-sm uppercase tracking-[0.3em] group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>Synchronize Data <span className="group-hover:translate-x-1 transition-transform">→</span></>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl premium-shadow text-center flex flex-col items-center justify-center animate-fadeInUp min-h-[400px]">
             {errorString && (
               <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest mb-8 rounded-2xl max-w-sm">
                  {errorString}
               </div>
             )}
             <button onClick={resetScanner} className="px-10 py-5 bg-white/5 font-black text-white rounded-2xl hover:bg-white/10 border border-white/10 transition-all uppercase tracking-[0.3em] text-[10px]">Retry Optical Link</button>
          </div>
        )}
      </div>
    </div>
  );
}
