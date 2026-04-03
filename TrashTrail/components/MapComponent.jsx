'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';

// Dark Map Tiles
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Define custom SVG DivIcons for seamless styling
const createDivIcon = (colorClass, pulseClass) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex w-full h-full rounded-full opacity-40 ${pulseClass}"></span>
        <span class="relative inline-flex rounded-full w-3.5 h-3.5 ${colorClass} shadow-[0_0_10px_currentColor] ring-2 ring-[#0A0A0A]"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const iconSettings = {
  collection: createDivIcon('bg-emerald-500 text-emerald-500', 'bg-emerald-400 animate-ping'),
  anomaly: createDivIcon('bg-red-500 text-red-500', 'bg-red-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]'),
  facility: createDivIcon('bg-blue-500 text-blue-500', 'bg-blue-400')
};

export default function MapComponent({ markers = [], center = [28.6139, 77.2090], zoom = 12 }) {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-0 block bg-[#0A0A0A]">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0 relative" style={{ minHeight: '400px', backgroundColor: '#000' }}>
        <TileLayer url={DARK_TILES} attribution={ATTRIBUTION} />
        
        {markers.map((marker, idx) => {
          const mIcon = iconSettings[marker.type] || iconSettings.collection;
          
          return (
            <Marker key={marker.id || idx} position={[marker.lat, marker.lng]} icon={mIcon}>
              <Popup className="dark-popup z-[9999]" closeButton={false}>
                <div className="bg-[#111111]/95 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl min-w-[220px]">
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white tracking-tight">{marker.title}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/10 ${marker.type === 'anomaly' ? 'bg-red-500/20 text-red-400' : marker.type === 'facility' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {marker.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">
                    {marker.info || marker.details || "No details provided for localized block node."}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <div className="absolute bottom-4 right-4 z-[999] pointer-events-none opacity-50">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest px-2 py-1 bg-black/50 rounded filter blur-[0.2px]">TrashTrail NavSystems</span>
        </div>
      </MapContainer>
      
      {/* Global overrides for leaflet popups to strip standard white container */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container {
          display: none !important; 
        }
        .leaflet-control-zoom a {
          background-color: #111111 !important;
          color: white !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #222222 !important;
        }
      `}</style>
    </div>
  );
}
