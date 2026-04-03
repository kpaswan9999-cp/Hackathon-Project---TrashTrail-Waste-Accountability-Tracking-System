'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraIcon, RefreshCw, XCircle, QrCode } from 'lucide-react';

export default function QRScanner({ onScanSuccess, onScanError }) {
  const [isError, setIsError] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode;
    const readerId = "reader";
    
    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(readerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode },
          { 
            fps: 15, 
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.7);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (onScanSuccess) onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Optional: Handle subtle scan errors if needed
          }
        );
        setIsError(false);
      } catch (err) {
        console.error("Camera start error:", err);
        setIsError(true);
      }
    };

    if (!showManual) {
      startScanner();
    }

    return () => {
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            scannerRef.current = null;
          }).catch(err => console.error("Scanner stop error:", err));
        } else {
          try { html5QrCode.clear(); } catch(e) {}
          scannerRef.current = null;
        }
      }
    };
  }, [facingMode, onScanSuccess, showManual]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim() && onScanSuccess) {
      onScanSuccess(manualCode.trim());
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center w-full max-w-lg mx-auto relative overflow-hidden group">
      {/* Decorative scanner lines glowing */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none z-0"></div>

      <div className="flex justify-between items-center w-full mb-6 z-10">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" /> {showManual ? 'Manual Uplink' : 'Scanner Active'}
        </h3>
        <div className="flex gap-2">
          {!showManual && (
            <button 
              onClick={toggleCamera} 
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all text-white shadow-sm border border-white/10"
              title="Switch Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => setShowManual(!showManual)} 
            className={`p-2.5 rounded-full transition-all border shadow-sm ${showManual ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
            title={showManual ? "Switch to Camera" : "Manual Entry"}
          >
            <CameraIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showManual ? (
        <div className="w-full aspect-square max-w-sm rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center p-8 z-10 glass-card">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <QrCode className="w-8 h-8 text-emerald-500" />
          </div>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 text-center">Identity Override</h4>
          <form onSubmit={handleManualSubmit} className="w-full space-y-4">
            <input 
              type="text" 
              placeholder="ENTER QR IDENTIFIER..." 
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-4 text-center text-emerald-400 font-black tracking-widest uppercase placeholder:text-emerald-900/50 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button 
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-lg glow-emerald transition-all active:scale-95"
            >
              Sync Artifact
            </button>
          </form>
          <p className="mt-6 text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">
            Example: TT-2025-XXXXX
          </p>
        </div>
      ) : isError ? (
        <div className="w-full aspect-square max-w-sm rounded-3xl border-2 border-red-500/30 bg-red-500/5 flex flex-col items-center justify-center p-8 text-center text-red-400 z-10 glass-card">
          <XCircle className="w-12 h-12 mb-4 animate-[pulse_2s_ease-in-out_infinite]" />
          <p className="font-bold text-lg mb-2 text-white">
            {typeof window !== 'undefined' && !window.isSecureContext ? 'Insecure Context' : 'Camera Access Denied'}
          </p>
          <p className="text-sm">
            {typeof window !== 'undefined' && !window.isSecureContext 
              ? "Browser blocks camera on HTTP IP addresses. Use Manual Mode or Localhost."
              : "Please allow camera permissions in your browser settings to scan bags."}
          </p>
          <button 
            onClick={() => setShowManual(true)}
            className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-xl border border-white/10 transition-all"
          >
            Switch to Manual Input
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 bg-black">
          {/* Viewfinder target box */}
          <div id="reader" className="w-full h-full"></div>
          
          {/* Scanning Animation Overlay - Handled via Tailwind */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Animated Bar - Simple CSS animation */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70 animate-scan"></div>
            
            {/* Darker edges for focus */}
            <div className="absolute inset-0 border-[40px] border-black/40"></div>
            
            {/* Corners */}
            <div className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
            <div className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center z-10">
        <p className="text-[10px] font-black text-gray-400 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full uppercase tracking-widest">
          <CameraIcon className="w-3 h-3 text-emerald-500" /> {showManual ? 'Direct Artifact Injection' : 'Bio-Metric Node Acquisition'}
        </p>
        {!isError && (
          <p className="mt-4 text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] animate-pulse">
            {showManual ? 'Ready for Manual Entry' : 'Locked on Target // Scanning...'}
          </p>
        )}
      </div>
    </div>
  );
}
