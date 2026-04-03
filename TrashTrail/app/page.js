'use client';

import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import { ChevronDown, EyeOff, AlertTriangle, Globe, QrCode, ScanLine, Building2, BarChart3, Brain, MapPin, ShieldAlert, Leaf, User, Check, Truck, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden selection:bg-emerald-500/30">
      
      {/* SECTION 1 — HERO */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        {/* Background Layer: Grid + Orbs + Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-grid-animate opacity-[0.2]"></div>
          
          {/* Animated Particles Layer - Wandering Dots */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-emerald-500/30 rounded-full animate-float-slow"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${15 + Math.random() * 25}s`,
                  animationDelay: `${Math.random() * -20}s`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
              ></div>
            ))}
          </div>

          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/20 blur-[130px] animate-float-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[110px] animate-float-slow [animation-delay:2s]"></div>
          
          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-scan z-10"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 w-full">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black leading-[0.95] tracking-tighter mb-10 animate-fadeInUp">
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">TRACING </span>
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">WASTE</span>
            <br />
            <span className="text-[0.4em] block mt-4 text-gray-500 uppercase tracking-[0.5em] font-black">Through the Digital Void</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mt-16 animate-fadeInUp delay-300">
            {/* Primary CTA - Cyber Glow */}
            <Link href="/register" className="group relative px-10 py-5 bg-emerald-500 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <span className="relative z-10 flex items-center gap-3 text-black font-black uppercase tracking-widest text-sm">
                Initiate Protocol <span className="text-xl group-hover:translate-x-2 transition-transform duration-500">→</span>
              </span>
              <div className="absolute -inset-1 bg-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity pointer-events-none translate-y-full group-hover:translate-y-0 duration-700"></div>
            </Link>

            {/* Secondary CTA - Glass Refraction */}
            <a href="#how-it-works" className="group relative px-10 py-5 glass bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20">
               <span className="relative z-10 flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm">
                <ScanLine className="w-5 h-5 text-emerald-400 group-hover:animate-pulse" />
                View Architecture
              </span>
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000"></div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-24 animate-fadeInUp delay-500 px-4">
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <AnimatedCounter icon="📦" target={5247} suffix="+" label="Bags Tracked" />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <AnimatedCounter icon="♻️" target={72} suffix="%" label="Recycling Rate" />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <AnimatedCounter icon="👥" target={1250} suffix="+" label="Citizens" />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <AnimatedCounter icon="🌱" target={42.5} suffix="T" label="CO2 Saved" />
            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-600 hover:text-emerald-500 transition-colors z-10">
          <a href="#problem"><ChevronDown className="w-8 h-8 opacity-70" /></a>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section id="problem" className="py-32 px-4 relative z-10 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="text-center mb-24">
          <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6 inline-block px-4 py-1.5 glass border border-emerald-500/20 rounded-full">Operational Criticality</span>
          <h2 className="text-4xl md:text-6xl font-black text-white max-w-4xl mx-auto leading-[1.1] tracking-tighter uppercase">
            Waste leaves the site. <span className="text-rose-500 glow-red">Integrity fails.</span>
          </h2>
          <p className="text-gray-500 text-sm mt-8 max-w-xl mx-auto font-bold uppercase tracking-widest leading-relaxed border-l-2 border-emerald-500/30 pl-6">
            Global metrics indicate 80% traceability collapse post-collection. We bridge the void.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { icon: EyeOff, title: 'Zero Transparency', desc: 'No verification layer for post-collection downstream processing.', color: 'emerald' },
            { icon: AlertTriangle, title: 'Systemic Decay', desc: 'Manual logging vulnerabilities lead to massive data corruption.', color: 'indigo' },
            { icon: Globe, title: 'Ecological Drift', desc: 'Untracked waste accelerate irreversible biosphere damage.', color: 'cyan' }
          ].map((item, i) => (
            <div key={i} className="glass p-10 rounded-[2rem] group transition-all duration-700 hover:bg-white/[0.03] border-white/[0.05] hover:border-white/10 premium-shadow">
              <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <item.icon className={`text-${item.color}-400 w-8 h-8`} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section id="how-it-works" className="py-40 px-4 bg-[#080808] border-y border-white/[0.03] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full"></div>
        
        <div className="text-center mb-32 relative z-10">
          <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6 inline-block">Protocol Sequence</span>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
            Architecting <span className="gradient-text">Certainty</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto relative z-10">
          {[
            { step: '01', icon: QrCode, title: 'Source Uplink', desc: 'Unique cryptographic QR generation at the point of origin.' },
            { step: '02', icon: ScanLine, title: 'Nexus Scan', desc: 'GPS-locked optical validation at the moment of collection.' },
            { step: '03', icon: Building2, title: 'Core Process', desc: 'Real-time sorting metrics logged via decentralized nodes.' },
            { step: '04', icon: BarChart3, title: 'Global Sync', desc: 'Universal transparency across all stakeholder intelligence hubs.' }
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 group hover:bg-white/5 transition-all duration-500 border-white/[0.03] hover:border-emerald-500/20">
              <div className="absolute -top-6 -left-4 w-14 h-14 rounded-2xl bg-black border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shadow-xl z-20 group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-500">
                {item.step}
              </div>
              <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] group-hover:rotate-12 transition-all duration-500 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <item.icon className="w-10 h-10 text-emerald-500 group-hover:text-white transition-colors relative z-10" />
              </div>
              <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section id="features" className="py-40 px-4 bg-[#050505]">
        <div className="text-center mb-24">
          <span className="text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6 inline-block border-b border-indigo-500/30 pb-2">Core Technologies</span>
          <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase">Powered by <span className="gradient-text-indigo">Intelligence</span></h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BIG CARD 1 — DATA INTEGRITY */}
          <div className="glass-card p-12 relative overflow-hidden md:col-span-2 group flex flex-col justify-end min-h-[450px] border-white/[0.03] hover:border-emerald-500/30 transition-all duration-700">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
            <div className="absolute top-10 right-10 text-[120px] font-black text-white/5 uppercase tracking-tighter select-none group-hover:text-emerald-500/10 transition-colors">DATA</div>
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 relative z-10">
              <QrCode className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase relative z-10">Cryptographic QR Infrastructure</h3>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-xl relative z-10">
              Every waste unit is assigned a unique digital fingerprint. 
              Immutable tracking across the entire supply chain nexus.
            </p>
            <div className="flex gap-4 mt-8 relative z-10">
              {['Traceable', 'Immutable', 'Verified'].map(tag => (
                <span key={tag} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em]">{tag}</span>
              ))}
            </div>
          </div>

          {/* SMALL CARD 1 — AI */}
          <div className="glass-card p-12 flex flex-col items-start justify-center group overflow-hidden relative border-white/[0.03] hover:border-cyan-500/30">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Brain className="w-8 h-8 text-cyan-400 group-hover:text-black" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">AI Classification</h3>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Neural analysis of waste morphology for automated sorting protocols.</p>
          </div>

          {/* SMALL CARD 2 — GIS */}
          <div className="glass-card p-12 flex flex-col items-start justify-center group overflow-hidden relative border-white/[0.03] hover:border-blue-500/30">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-black transition-all">
              <MapPin className="w-8 h-8 text-blue-400 group-hover:text-black" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">GIS Telemetry</h3>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Real-time geospatial tracking of all active collection units.</p>
          </div>

          {/* BIG CARD 2 — DOMINION HUB */}
          <div className="glass-card p-12 relative overflow-hidden md:col-span-2 group min-h-[450px] flex flex-col justify-end border-white/[0.03] hover:border-indigo-500/30 transition-all duration-700">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
             <div className="absolute top-10 right-10 text-[120px] font-black text-white/5 uppercase tracking-tighter select-none group-hover:text-indigo-500/10 transition-colors">HUB</div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 relative z-10">
              <BarChart3 className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase relative z-10">Unified Command Interface</h3>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-xl relative z-10">
              Aggregated intelligencehub for administrative surveillance, anomaly detection, and contractor performance rating.
            </p>
            <div className="flex gap-4 mt-8 relative z-10">
              {['Surveillance', 'Analytics', 'Anomaly'].map(tag => (
                <span key={tag} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em]">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — STAKEHOLDERS */}
      <section className="py-40 px-4 bg-[#080808] border-y border-white/[0.03] relative z-10">
        <div className="text-center mb-32">
          <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6 inline-block">Operational Roles</span>
          <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase">Nexus <span className="gradient-text">Users</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto items-stretch">
          
          {/* CITIZEN NODE */}
          <div className="glass-card p-12 border-t-2 border-emerald-500/50 group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
            <div className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-12 border-b border-white/5 pb-4">Node: Citizen</div>
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <User className="text-emerald-400 w-10 h-10" />
            </div>
            <ul className="space-y-6 mb-12">
              {['Source QR Initialization', 'Lifecycle Trajectory Tracking', 'Green Score Accumulation', 'Emission Offset Analytics'].map(txt => (
                <li key={txt} className="flex items-start gap-4">
                  <div className="p-1 rounded bg-emerald-500/10 mt-1"><Check className="w-3 h-3 text-emerald-400" /></div>
                  <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">{txt}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all">
               Initialize Account
            </Link>
          </div>

          {/* COLLECTOR NODE */}
          <div className="glass-card p-12 border-t-2 border-amber-500/50 group hover:bg-white/[0.02] transition-colors relative overflow-hidden scale-105 z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
            <div className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-12 border-b border-white/5 pb-4">Node: Collector</div>
            <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Truck className="text-amber-400 w-12 h-12" />
            </div>
            <ul className="space-y-6 mb-12">
              {['Nexus QR Optical Validation', 'GPS-Locked Path Protocols', 'Telemetry Weight Verification', 'Operational Reputation Metrics'].map(txt => (
                <li key={txt} className="flex items-start gap-6">
                   <div className="p-1.5 rounded-lg bg-amber-500/10 mt-1"><Check className="w-4 h-4 text-amber-400" /></div>
                   <span className="text-gray-200 text-xs font-black uppercase tracking-[0.1em]">{txt}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-6 text-center text-[11px] font-black uppercase tracking-[0.4em] text-black bg-amber-500 rounded-2xl shadow-lg glow-amber hover:bg-amber-400 transition-all">
               Link Subsystem
            </Link>
          </div>

          {/* ADMIN NODE */}
          <div className="glass-card p-12 border-t-2 border-indigo-500/50 group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
            <div className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-12 border-b border-white/5 pb-4">Node: Authority</div>
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
              <Shield className="text-indigo-400 w-10 h-10" />
            </div>
            <ul className="space-y-6 mb-12">
              {['Sector-Wide Surveillance', 'Anomaly Detection Algorithms', 'Contractor Behavior Rating', 'Strategic Intelligence Hub'].map(txt => (
                <li key={txt} className="flex items-start gap-4">
                  <div className="p-1 rounded bg-indigo-500/10 mt-1"><Check className="w-3 h-3 text-indigo-400" /></div>
                  <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">{txt}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="block w-full py-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 border border-indigo-500/30 rounded-2xl hover:bg-indigo-500 hover:text-black transition-all">
               Dominion Access
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 6 — IMPACT */}
      <section className="py-32 px-4 relative overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-[#0A0A0A] to-cyan-950/40 z-0 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-20 drop-shadow-md">
            Our Impact in <span className="gradient-text">Numbers</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 glass-card p-12 bg-black/40 border-white/5 shadow-2xl">
            <AnimatedCounter icon="📦" target={5247} suffix="+" label="Bags Tracked" />
            <AnimatedCounter icon="♻️" target={72} suffix="%" label="Recycling Rate" />
            <AnimatedCounter icon="👥" target={1250} suffix="+" label="Active Citizens" />
            <AnimatedCounter icon="🌱" target={42} suffix="T" label="CO2 Saved" />
          </div>
        </div>
      </section>

      {/* SECTION 7 — TECH STACK */}
      <section className="py-20 px-4 border-y border-white/5 bg-[#111111]">
         <h4 className="text-center text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-10">Constructed Utilizing Paradigm Shifts</h4>
         <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
           {['⚛️ React', '▲ Next.js 14', '📁 Local JSON DB', '🎨 Tailwind CSS', '🗺️ Leaflet.js', '📊 Recharts AI', '🤖 Google Gemini 1.5', '📱 ZXing QR Core'].map(tech => (
             <div key={tech} className="glass-card border-white/10 px-6 py-3 flex items-center justify-center gap-3 text-sm font-bold text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-default shadow-sm group">
               <span className="group-hover:scale-110 transition-transform">{tech}</span>
             </div>
           ))}
         </div>
      </section>

      {/* SECTION 8 — CTA */}
      <section className="py-32 px-4 relative bg-[#0A0A0A] overflow-hidden">
        
        <div className="absolute w-[1000px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 glass-card max-w-3xl mx-auto p-16 text-center border-2 border-emerald-500/20 bg-black/60 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="text-6xl mb-6 animate-bounce drop-shadow-xl inline-block">🚀</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg tracking-tight">Ready to make waste truly transparent?</h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto font-medium leading-relaxed">Join the platform revolutionizing accountability today. Be a part of building the sustainable smart city of tomorrow.</p>
          
          <Link href="/register" className="inline-block mt-10 bg-emerald-500 hover:bg-emerald-400 text-white font-black px-12 py-5 rounded-2xl text-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] glow-emerald hover:scale-105 transition-all duration-300">
            Commence Mission <span className="ml-2 font-mono">→</span>
          </Link>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-6">Open Source Initiative • Completely Secure</p>
        </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="py-16 pt-24 border-t border-white/10 bg-[#0D0D0D] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 group mb-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-emerald-500 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative glass bg-black/40 border border-white/10 p-2 rounded-xl">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl text-white tracking-tighter leading-none">
                    Trash<span className="text-emerald-400">Trail</span>
                  </span>
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">
                    Systems Directive
                  </span>
                </div>
              </Link>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed max-w-md border-l-2 border-emerald-500/30 pl-6">
                From Dustbin to Destination. <br />
                <span className="opacity-60 text-[10px]">Interconnected metrics validating circular economy efficiency across all city-wide sectors.</span>
              </p>
            </div>

            <div>
               <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10 w-fit">Index Grid</h4>
               <ul className="space-y-4">
                 {['How It Works', 'Engine Features', 'Carbon Impact', 'Login Portal', 'Registration'].map(link => (
                   <li key={link}><a href="#" className="text-gray-500 hover:text-emerald-400 text-sm font-semibold transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"><span className="text-emerald-500/50">›</span> {link}</a></li>
                 ))}
               </ul>
            </div>

            <div>
               <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10 w-fit">Deployment</h4>
               <p className="text-gray-400 font-bold text-sm mb-2">Nebulon'26 Hackathon</p>
               <p className="text-gray-600 text-xs font-medium mb-6">Open Infrastructure Concept Phase</p>
               
               {/* GitHub Logo Placeholder Button */}
               <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer shadow-sm group">
                  <div className="w-5 h-5 bg-white rounded-full group-hover:bg-emerald-400 transition-colors flex items-center justify-center">
                    <span className="text-[#111111] text-[10px] font-black">GH</span>
                  </div>
                  <span className="text-gray-300 font-bold text-sm">Source Core</span>
               </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs font-bold tracking-wider">
              © {new Date().getFullYear()} TRASHTRAIL DIRECTIVE. <span className="opacity-50">ARCHITECTED FOR A CLEANER FUTURE.</span>
            </p>
            <p className="text-gray-700 text-xs font-extrabold flex gap-3 tracking-widest uppercase">
              <span>Next.js 14</span>
              <span>•</span>
              <span>Local JSON DB</span>
              <span>•</span>
              <span>Tailwind</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
