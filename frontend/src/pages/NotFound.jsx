import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl relative overflow-hidden page-enter">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      
      {/* Moving Radar/Sweep Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]">
            <div className="absolute top-0 right-1/2 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent rounded-tl-full"></div>
         </div>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10 fade-in-up">
        {/* Glowing Icon */}
        <div className="mb-md relative group">
          <div className="absolute inset-0 bg-secondary/10 rounded-full blur-[50px] scale-[2] group-hover:bg-secondary/20 transition-colors duration-500 animate-pulse"></div>
          <div className="glass w-48 h-48 rounded-full flex items-center justify-center relative z-10 border border-secondary/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-2 rounded-full border border-secondary/20 border-dashed animate-[spin_10s_linear_infinite_reverse]"></div>
            <span className="material-symbols-outlined text-[80px] text-secondary group-hover:text-primary transition-colors text-glow" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24" }}>
              satellite_alt
            </span>
          </div>
        </div>

        {/* Error Code */}
        <div className="font-mono text-[140px] leading-none font-bold text-outline-variant/30 select-none tracking-tighter" aria-hidden="true" style={{ textShadow: '0 0 20px rgba(185,199,228,0.1)' }}>
          404
        </div>

        <div className="glass px-10 py-8 rounded-3xl border border-outline-variant/30 -mt-10 relative z-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center hover-lift">
            <h1 className="font-headline-lg text-on-surface mb-sm tracking-tight text-glow flex items-center gap-3">
            Signal Lost
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-xl leading-relaxed">
            The page you're looking for has been decommissioned or doesn't exist in this sector. Try returning to the main hub.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-xl w-full">
            <Link
                to="/"
                className="bg-primary text-on-primary font-label-md px-8 py-3.5 rounded-xl inline-flex items-center justify-center gap-3 btn-ripple glow-primary hover:glow-primary-hover transition-all uppercase tracking-widest text-[12px] font-bold group"
            >
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-1 transition-transform">home</span>
                Return to Base
            </Link>
            <Link
                to="/products"
                className="bg-surface-container border border-outline-variant/50 text-on-surface font-label-md px-8 py-3.5 rounded-xl inline-flex items-center justify-center gap-3 hover:border-primary hover:bg-primary/10 transition-colors uppercase tracking-widest text-[12px] group"
            >
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">explore</span>
                Browse Products
            </Link>
            </div>

            {/* Decorative technical specs */}
            <div className="grid grid-cols-3 gap-8 opacity-50 w-full pt-6 border-t border-outline-variant/20 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center group/stat">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1 group-hover/stat:text-primary transition-colors">Status</span>
                <span className="font-body-md text-on-surface font-mono text-sm group-hover/stat:text-primary transition-colors">ROUTE_NULL</span>
            </div>
            <div className="flex flex-col items-center group/stat">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1 group-hover/stat:text-secondary transition-colors">Error Code</span>
                <span className="font-body-md text-on-surface font-mono text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded border border-secondary/20">HTTP_404</span>
            </div>
            <div className="flex flex-col items-center group/stat">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mb-1 group-hover/stat:text-error transition-colors">Latency</span>
                <span className="font-body-md text-error font-mono text-xl group-hover/stat:text-error transition-colors leading-none">∞</span>
            </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
