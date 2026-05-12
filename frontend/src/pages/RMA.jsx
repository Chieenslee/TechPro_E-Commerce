import React from 'react';

const RMA = () => {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl gap-xl page-enter">
      {/* Hero Section: Track RMA */}
      <section className="w-full flex flex-col items-center text-center gap-md fade-in-up">
        <h1 className="font-headline-xl text-primary text-glow">RMA Portal</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">Precision technical service and repair tracking. Enter your RMA number or serial code to monitor your device's status in our clinical repair facility.</p>
        <div className="w-full max-w-3xl mt-lg relative group/input">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline-variant group-focus-within/input:text-[#00ffff] transition-colors" style={{ fontVariationSettings: "'wght' 200" }}>search</span>
          </div>
          <input className="w-full bg-surface-container border border-outline-variant/50 rounded-xl focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] text-on-surface font-body-md py-5 pl-16 pr-40 tracking-wider transition-all placeholder:text-outline-variant/50 hover:border-[#00ffff]/50 shadow-[0_0_30px_rgba(0,255,255,0.05)]" placeholder="Enter RMA or Serial Number..." type="text" />
          <button className="absolute inset-y-2 right-2 bg-[#00ffff] text-primary-container font-label-md px-8 rounded-lg hover:bg-[#00e6e6] transition-colors font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)] btn-ripple tracking-widest uppercase">TRACK</button>
        </div>
      </section>
      
      {/* Process Section (Bento Grid) */}
      <section className="w-full flex flex-col gap-lg mt-xl fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00ffff] animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
          <h2 className="font-headline-md text-primary text-glow">Repair Protocol</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter stagger-children">
          {/* Step 1 */}
          <div className="glass rounded-3xl p-xl flex flex-col gap-sm relative overflow-hidden group hover:border-[#00ffff]/50 border border-outline-variant/30 transition-colors hover-lift">
            <div className="absolute -right-4 -top-4 opacity-5 text-[150px] font-bold font-headline-xl leading-none group-hover:text-[#00ffff] transition-colors">01</div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-md group-hover:bg-[#00ffff]/20 transition-colors">
               <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>biotech</span>
            </div>
            <h3 className="font-headline-lg-mobile text-on-surface group-hover:text-[#00ffff] transition-colors">Diagnosis</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">Clinical teardown and diagnostic imaging to isolate hardware faults with microscopic precision.</p>
            <div className="mt-auto pt-6 flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">Telemetry</span>
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">X-Ray Scans</span>
            </div>
          </div>
          {/* Step 2 */}
          <div className="glass rounded-3xl p-xl flex flex-col gap-sm relative overflow-hidden group hover:border-[#00ffff]/50 border border-outline-variant/30 transition-colors hover-lift">
            <div className="absolute -right-4 -top-4 opacity-5 text-[150px] font-bold font-headline-xl leading-none group-hover:text-[#00ffff] transition-colors">02</div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-md group-hover:bg-[#00ffff]/20 transition-colors relative">
               <div className="absolute inset-0 rounded-2xl border border-[#00ffff]/0 group-hover:border-[#00ffff]/50 animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>build</span>
            </div>
            <h3 className="font-headline-lg-mobile text-on-surface group-hover:text-[#00ffff] transition-colors">Repair</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">Component-level microsoldering and OEM parts replacement in a static-free, cleanroom environment.</p>
            <div className="mt-auto pt-6 flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">OEM Parts</span>
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">Class 100</span>
            </div>
          </div>
          {/* Step 3 */}
          <div className="glass rounded-3xl p-xl flex flex-col gap-sm relative overflow-hidden group hover:border-[#00ffff]/50 border border-outline-variant/30 transition-colors hover-lift">
            <div className="absolute -right-4 -top-4 opacity-5 text-[150px] font-bold font-headline-xl leading-none group-hover:text-[#00ffff] transition-colors">03</div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary mb-md group-hover:bg-[#00ffff]/20 transition-colors">
               <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>fact_check</span>
            </div>
            <h3 className="font-headline-lg-mobile text-on-surface group-hover:text-[#00ffff] transition-colors">Quality Control</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">Rigorous automated stress testing and calibration to ensure factory-grade performance metrics.</p>
            <div className="mt-auto pt-6 flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">Stress Test</span>
              <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-[10px] font-label-sm uppercase text-on-surface-variant tracking-widest">Calibration</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full rounded-3xl p-xl flex flex-col md:flex-row items-center justify-between gap-xl mt-xl mb-xl relative overflow-hidden glass border border-primary/30 fade-in-up hover-lift shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
        {/* Tech grid overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
        <div className="flex flex-col gap-md z-10 max-w-2xl">
          <h2 className="font-headline-lg text-on-surface text-glow">Require Immediate Assistance?</h2>
          <p className="font-body-lg text-on-surface-variant leading-relaxed">Bypass the queue. Schedule a certified technician for on-site diagnostic service or specialized hardware consultation.</p>
        </div>
        <button className="z-10 bg-surface-container border border-primary text-primary font-label-md px-10 py-4 rounded-xl hover:bg-primary/20 hover:border-[#00ffff] transition-all flex items-center gap-3 whitespace-nowrap btn-ripple tracking-widest uppercase font-bold text-[12px] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 200" }}>calendar_today</span>
          Schedule a Technician
        </button>
      </section>
    </main>
  );
};

export default RMA;
