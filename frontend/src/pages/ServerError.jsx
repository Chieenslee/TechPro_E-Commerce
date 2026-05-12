import React from 'react';
import { Link } from 'react-router-dom';

const ServerError = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop w-full text-center gap-lg relative overflow-hidden page-enter">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-error/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>
      
      {/* Tech grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#FF5449_1px,transparent_1px),linear-gradient(to_bottom,#FF5449_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center max-w-[800px] w-full gap-lg fade-in-up">
        {/* Error Visual Representation */}
        <div className="relative flex justify-center items-center group">
          {/* Glassmorphic Container for Icon */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full glass border border-error/30 flex justify-center items-center shadow-[0_0_50px_rgba(255,84,73,0.1)] relative">
            {/* Glitch/Disconnect Icon */}
            <span className="material-symbols-outlined text-6xl md:text-8xl text-error animate-pulse text-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
              wifi_off
            </span>
            {/* Orbiting/Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-error rounded-full shadow-[0_0_15px_rgba(255,84,73,0.8)] animate-bounce"></div>
            <div className="absolute bottom-4 right-0 translate-x-1/2 w-2 h-2 bg-on-surface-variant rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 w-3 h-3 bg-error/40 rounded-full"></div>
             <div className="absolute inset-0 rounded-full border-[2px] border-error/20 animate-[spin_3s_linear_infinite_reverse]"></div>
          </div>
          {/* Abstract Circuit Lines */}
          <div className="absolute inset-0 pointer-events-none -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-1/2 left-[-100px] w-[150px] h-[1px] bg-gradient-to-r from-transparent to-error/50"></div>
            <div className="absolute top-1/2 right-[-100px] w-[150px] h-[1px] bg-gradient-to-l from-transparent to-error/50"></div>
            <div className="absolute top-[-100px] left-1/2 w-[1px] h-[150px] bg-gradient-to-b from-transparent to-error/50"></div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="flex flex-col gap-base max-w-[600px]">
          {/* Status Badge */}
          <div className="flex justify-center mb-sm">
            <div className="flex items-center gap-2 bg-error/10 border border-error/30 rounded-full px-4 py-1.5 shadow-[0_0_10px_rgba(255,84,73,0.1)]">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_10px_rgba(255,84,73,0.8)]"></span>
              <span className="font-label-sm uppercase tracking-widest text-error font-bold text-[11px]">System Error 503</span>
            </div>
          </div>
          {/* Headline */}
          <h1 className="font-headline-xl text-on-surface tracking-tight text-glow group-hover:text-error transition-colors">Connection Lost</h1>
          {/* Description */}
          <p className="font-body-lg text-on-surface-variant mt-xs leading-relaxed">
            The mainframe is currently experiencing high load or a critical data routing failure. Please await connection stabilization.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-md flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/" className="bg-error/10 text-error border border-error/30 hover:bg-error hover:text-on-error transition-all duration-300 rounded-lg px-8 py-3.5 font-label-md flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(255,84,73,0.1)] hover:shadow-[0_0_30px_rgba(255,84,73,0.3)] btn-ripple font-bold uppercase tracking-widest text-[12px]">
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">
              refresh
            </span>
            Retry Handshake
          </Link>
          <Link to="/contact" className="glass text-on-surface-variant hover:text-primary border border-outline-variant/30 hover:border-primary/50 transition-colors duration-300 rounded-lg px-8 py-3.5 font-label-md flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]">
            <span className="material-symbols-outlined text-[20px]">
              support_agent
            </span>
            Contact Support
          </Link>
        </div>

        {/* Technical Diagnostics */}
        <div className="mt-xl w-full max-w-[400px] glass border border-outline-variant/30 rounded-2xl p-md text-left hover-lift hover:border-error/30 transition-colors group">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Diagnostic Output</span>
            <span className="material-symbols-outlined text-[16px] text-error group-hover:animate-pulse">terminal</span>
          </div>
          <div className="flex flex-col gap-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">
            <div className="flex justify-between items-center group/line">
              <span className="group-hover/line:text-error transition-colors">Trace Code:</span>
              <span className="text-error bg-error/10 px-2 py-0.5 rounded border border-error/20">ERR_CONNECTION_TIMED_OUT</span>
            </div>
            <div className="flex justify-between items-center group/line">
              <span className="group-hover/line:text-primary transition-colors">Timestamp:</span>
              <span className="text-on-surface">{new Date().toISOString()}</span>
            </div>
            <div className="flex justify-between items-center group/line">
              <span className="group-hover/line:text-error transition-colors">Network Status:</span>
              <span className="text-error flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> OFFLINE
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Branding Footer */}
      <div className="absolute bottom-margin-desktop left-0 right-0 text-center pointer-events-none opacity-20 z-0">
        <span className="font-headline-xl font-bold text-primary tracking-widest uppercase text-glow">TechPro</span>
      </div>
    </main>
  );
};

export default ServerError;
