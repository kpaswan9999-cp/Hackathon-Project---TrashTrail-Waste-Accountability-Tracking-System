'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Camera, Loader2, CheckCircle } from 'lucide-react';

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [complaints, setComplaints] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'missed_pickup',
    description: '',
    location: null,
    ward: '',
  });

  useEffect(() => {
    axios.get('/api/complaints').then(res => {
      setComplaints(res.data.complaints || []);
    }).catch(console.error);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
          ward: 'Ward 42 (Auto)'
        }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        photoUrl: 'temp-url',
      };
      
      const res = await axios.post('/api/complaints', payload);
      setSuccessMsg('Issue reported successfully. Authorities have been notified.');
      setComplaints([res.data.complaint, ...complaints]);
      setFormData({ ...formData, description: '' });
    } catch (err) {
      setErrorMsg('Failed to submit report. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Report an Issue</h1>
        <p className="text-sm font-medium text-slate-500">Help us keep the city clean by reporting waste management issues.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-md border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> {successMsg}
          </div>
        )}
        {errorMsg && <div className="p-4 bg-red-50 text-red-800 text-sm rounded-md border border-red-200">{errorMsg}</div>}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Issue Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-red-600 sm:text-sm font-medium bg-slate-50"
          >
            <option value="missed_pickup">Missed Pickup</option>
            <option value="improper_handling">Improper Handling</option>
            <option value="overflow">Bin Overflow</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-red-600 sm:text-sm bg-slate-50"
            placeholder="Please provide details about the issue..."
          />
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Photo</label>
           <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-6 hover:bg-slate-50 transition-colors bg-white">
             <div className="text-center">
               <div className="flex text-sm leading-6 text-slate-600 justify-center">
                 <label
                   htmlFor="file-upload"
                   className="relative cursor-pointer rounded-md font-bold text-red-600 focus-within:outline-none hover:text-red-500 underline"
                 >
                   <span>Use Camera / Upload Picture</span>
                   <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" capture="environment" />
                 </label>
               </div>
             </div>
           </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Location Detection</label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 shadow-sm">
              <MapPin className="h-5 w-5 text-blue-600" />
            </span>
            <div className="text-sm text-slate-700">
              {formData.location ? (
                <>
                  <span className="font-bold text-slate-900">{formData.ward}</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}</span>
                </>
              ) : (
                <span className="font-medium animate-pulse text-blue-600">Detecting exact location using GPS...</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.location}
          className="w-full flex justify-center items-center rounded-md bg-red-600 px-3 py-3 text-base font-bold text-white shadow-md hover:bg-red-500 disabled:opacity-50 transition-all"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>

      {/* Previous Complaints list */}
      {complaints.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">My Previous Complaints</h2>
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full capitalize capitalize border ${
                      c.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' :
                      c.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-slate-900 capitalize tracking-tight">{c.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate max-w-lg font-medium">{c.description}</p>
                </div>
                <div className="text-right text-xs font-bold text-slate-400 whitespace-nowrap pt-1">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
