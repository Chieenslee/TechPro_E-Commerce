import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl relative overflow-hidden page-enter">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-error/10 rounded-full blur-[100px] opacity-70 animate-pulse"></div>
      </div>
      
      {/* Failure Card Component (Glassmorphism + Minimalism) */}
      <div className="relative z-10 w-full max-w-2xl bg-surface-container-low/80 backdrop-blur-xl border border-error/30 rounded-3xl p-lg shadow-[0_0_50px_rgba(255,84,73,0.1)] flex flex-col items-center text-center fade-in-up glass group hover:border-error/50 transition-colors">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#FF5449_1px,transparent_1px),linear-gradient(to_bottom,#FF5449_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none rounded-3xl"></div>

        {/* Error Icon */}
        <div className="relative w-24 h-24 mb-lg flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-error/20 animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-2 rounded-full border border-error/40 animate-[spin_3s_linear_infinite_reverse]"></div>
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,84,73,0.3)] relative z-10">
            <span className="material-symbols-outlined text-error text-[40px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
        </div>
        
        {/* Error Headlines */}
        <h1 className="font-headline-lg font-bold text-error mb-sm tracking-tight text-glow">Transaction Failed</h1>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-lg leading-relaxed">
          The payment gateway rejected the connection due to an invalid authorization token or network timeout. Please verify your credentials and retry.
        </p>
        
        {/* Technical Spec List */}
        <div className="w-full bg-surface-container/80 border border-outline-variant/30 rounded-2xl p-md mb-xl text-left hover-lift">
          <div className="grid grid-cols-2 gap-y-4 gap-x-md">
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1">Trace ID</span>
              <span className="font-body-md text-on-surface font-mono tracking-wider text-[13px] bg-error/10 text-error px-2 py-1 rounded w-fit border border-error/20">TXN-9028-441A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1">Timestamp</span>
              <span className="font-body-md text-on-surface font-mono text-[13px]">24 Oct 2024, 14:05 UTC</span>
            </div>
            <div className="flex flex-col col-span-2 mt-2 pt-4 border-t border-outline-variant/20">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1">Payload Size (Total)</span>
              <span className="font-headline-md font-bold text-error text-glow">$3,499.00</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center relative z-10">
          <Link to="/checkout" className="bg-error/10 text-error border border-error/30 font-label-md px-8 py-3.5 rounded-lg hover:bg-error hover:text-on-error transition-all duration-300 flex items-center justify-center gap-3 btn-ripple uppercase tracking-widest text-[12px] font-bold shadow-[0_0_15px_rgba(255,84,73,0.1)] hover:shadow-[0_0_20px_rgba(255,84,73,0.3)]">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Retry Protocol
          </Link>
          <Link to="/contact" className="bg-surface-container border border-outline-variant/50 text-on-surface font-label-md px-8 py-3.5 rounded-lg hover:bg-white/5 hover:border-primary transition-colors duration-300 flex items-center justify-center gap-3 btn-ripple uppercase tracking-widest text-[12px]">
            <span className="material-symbols-outlined text-[20px] text-primary">support_agent</span>
            Contact Support Node
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailed;
