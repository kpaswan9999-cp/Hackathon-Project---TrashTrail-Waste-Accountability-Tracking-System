'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle2 } from 'lucide-react';

export default function QRGenerator({ qrValue }) {
  const [success, setSuccess] = useState(true);
  const containerRef = useRef(null);

  // Success animation on mount
  useEffect(() => {
    setSuccess(true);
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [qrValue]);

  const handleDownloadPNG = () => {
    const svg = document.getElementById('qr-svg');
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Fill background with black for saving
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(unescape(encodeURIComponent(xml)));
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${qrValue}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${svg64}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card p-10 flex flex-col items-center justify-center relative overflow-hidden group">
      
      {/* Success Confetti/Highlight */}
      <div className={`absolute inset-0 bg-emerald-500/20 backdrop-blur-sm z-20 flex flex-col items-center justify-center transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
        <h3 className="text-xl font-black text-white tracking-tight">QR Generated!</h3>
      </div>

      <div className="bg-[#111111] p-6 rounded-3xl border-2 border-emerald-500/30 glow-emerald shadow-2xl relative" ref={containerRef}>
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-3xl -z-10"></div>
        <QRCodeSVG
          id="qr-svg"
          value={qrValue}
          size={220}
          fgColor="#10B981"
          bgColor="transparent"
          level="H"
          includeMargin={false}
        />
        {/* Mock Leaf center graphic directly positioned */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#111111] p-1.5 rounded-lg border border-emerald-500/50 flex items-center justify-center w-10 h-10 shadow-lg glow-emerald">
          <span className="text-xl">🌿</span>
        </div>
      </div>

      <p className="mt-8 font-mono text-xl font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-6 py-2 rounded-xl border border-emerald-500/20 shadow-inner">
        {qrValue}
      </p>
      
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4 text-center max-w-[250px]">
        Scan this code using the physical collector scanner system
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full">
        <button 
          onClick={handleDownloadPNG}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl px-6 py-3.5 glow-emerald transition-all w-full"
        >
          <Download className="w-5 h-5" /> Download PNG
        </button>
        <button 
          onClick={handlePrint}
          className="flex flex-1 items-center justify-center gap-2 bg-white/5 border-2 border-white/10 hover:bg-white/10 text-white font-bold rounded-xl px-6 py-3.5 transition-all outline-none w-full shadow-sm"
        >
          <Printer className="w-5 h-5 opacity-70" /> Print Target
        </button>
      </div>
    </div>
  );
}
