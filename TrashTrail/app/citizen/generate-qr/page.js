'use client';

import { useState } from 'react';
import axios from 'axios';
import { Camera, CheckCircle, Loader2 } from 'lucide-react';
import QRGenerator from '@/components/QRGenerator';

export default function GenerateQRPage() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    wasteType: 'dry',
    weightAtSource: '',
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app we'd upload photo to Cloudinary here first
      const payload = {
        wasteType: formData.wasteType,
        weightAtSource: Number(formData.weightAtSource),
        photoUrl: 'temp-url', // Placeholder for actual upload
      };
      
      const res = await axios.post('/api/waste', payload);
      setSuccessData(res.data.wasteBag);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate QR Code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-fadeInUp">
        <div className="glass p-10 rounded-2xl text-center relative overflow-hidden premium-shadow">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-8 glow-emerald">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">Node Registered</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">Paste Identifier On Physical Waste Package</p>
          
          <div className="flex justify-center mb-10 p-6 glass bg-white/5 rounded-2xl inline-block border-white/10 shadow-inner">
            <QRGenerator qrValue={successData.qrCode} size={200} />
          </div>

          <div className="glass bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-left max-w-sm mx-auto space-y-3">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</span>
              <span className="text-sm font-black text-emerald-400 uppercase tracking-tight">{successData.wasteType}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Initial Mass</span>
              <span className="text-sm font-black text-white tracking-tight">{successData.weightAtSource} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</span>
              <span className="text-sm font-black text-gray-400 tracking-tight">{new Date(successData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={() => {
                setSuccessData(null);
                setFormData({ wasteType: 'dry', weightAtSource: '', photo: null });
                setPreviewUrl('');
              }}
              className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] hover:text-emerald-300 transition-colors border-b-2 border-emerald-500/20 pb-1"
            >
              Initialize New Node →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 animate-fadeInUp">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Register Waste</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Initiating New Traceable Data Point</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-2xl premium-shadow space-y-10">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-xl">
            {error}
          </div>
        )}
        
        {/* Waste Type */}
        <div className="space-y-6 text-center">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] block text-center mb-6">Select Material Classification</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'dry', label: 'Dry 🗞️' },
              { id: 'wet', label: 'Wet 🍌' },
              { id: 'hazardous', label: 'Hazardous ⚠️' },
              { id: 'mixed', label: 'Mixed 📦' }
            ].map(type => (
              <label 
                key={type.id} 
                className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all group ${
                  formData.wasteType === type.id 
                    ? 'border-emerald-500/50 bg-emerald-500/10 glow-emerald scale-[1.05]'
                    : 'border-white/5 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <input
                  type="radio"
                  name="wasteType"
                  value={type.id}
                  checked={formData.wasteType === type.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">{type.label.split(' ')[1]}</span>
                <span className={`block text-[10px] font-black uppercase tracking-widest ${formData.wasteType === type.id ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {type.label.split(' ')[0]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Approximate Weight */}
        <div className="space-y-4">
          <label htmlFor="weightAtSource" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
            Quantified Mass Estimate (KG)
          </label>
          <div className="relative group">
            <input
              type="number"
              id="weightAtSource"
              name="weightAtSource"
              min="0.1"
              step="0.1"
              required
              value={formData.weightAtSource}
              onChange={handleChange}
              className="w-full pl-6 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-black text-xl tracking-tight"
              placeholder="0.0"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-600 text-sm uppercase tracking-widest">Kilograms</div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Optical Verification (Optional)</label>
          <div className="relative group overflow-hidden rounded-2xl">
            <div className={`mt-1 flex justify-center rounded-2xl border-2 border-dashed transition-all p-10 bg-white/[0.02] ${previewUrl ? 'border-emerald-500/30' : 'border-white/5 group-hover:border-white/20'}`}>
              <div className="text-center">
                {previewUrl ? (
                  <div className="mx-auto mb-6 relative">
                    <img src={previewUrl} alt="Preview" className="h-48 object-contain mx-auto rounded-xl shadow-2xl border-2 border-white/10 p-2 bg-black/40" />
                    <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 animate-pulse border-2 border-black"></div>
                  </div>
                ) : (
                  <div className="bg-white/5 h-20 w-20 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all border border-white/10 shadow-inner">
                    <Camera className="h-10 w-10 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                )}
                <div className="flex text-[10px] font-black items-center justify-center uppercase tracking-[0.2em]">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors border-b-2 border-emerald-500/20 pb-0.5"
                  >
                    <span>Activate Interface / Upload</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" capture="environment" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all uppercase tracking-[0.3em] text-sm group active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>Initialize Digital Twin <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span></>
          )}
        </button>
      </form>
    </div>
  );
}
