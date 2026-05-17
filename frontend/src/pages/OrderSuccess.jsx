import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl page-enter relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl bg-surface-container-lowest/80 rounded-3xl border border-primary/20 p-8 md:p-12 flex flex-col items-center text-center glass shadow-[0_0_50px_rgba(185,199,228,0.1)] relative z-10 fade-in-up">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/30 glow-primary relative">
          <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_3s_linear_infinite_reverse]"></div>
          <span className="material-symbols-outlined text-primary text-5xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Thank You Message */}
        <h1 className="font-headline-lg text-primary mb-4 tracking-tight text-glow">Deployment Confirmed</h1>
        <p className="font-body-md text-on-surface-variant mb-8 max-w-md leading-relaxed">
          Thank you for your request. Your order has been successfully placed and is now being processed with maximum precision.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-surface-container rounded-2xl border border-outline-variant/30 p-6 mb-10 text-left hover-lift transition-transform">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant/30 pb-4 mb-4 gap-4">
            <div>
              <span className="font-label-sm text-on-surface-variant block mb-1 uppercase tracking-widest text-[11px]">Protocol ID</span>
              <span className="font-headline-md text-on-surface tracking-wider font-mono">#TP-2024-89012</span>
            </div>
            <div className="md:text-right">
              <span className="font-label-sm text-on-surface-variant block mb-1 uppercase tracking-widest text-[11px]">Estimated Delivery</span>
              <span className="font-body-lg text-primary font-bold">Oct 24 – Oct 26</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg border border-primary/20">local_shipping</span>
            <span className="font-body-md text-on-surface-variant">
              We will transmit a confirmation signal with tracking vectors shortly.
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="w-full mb-10 stagger-children">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-[2px] bg-outline-variant/20 mx-8"></div>
            <div className="absolute left-0 right-2/3 top-5 h-[2px] bg-primary mx-8 shadow-[0_0_10px_rgba(185,199,228,0.5)]"></div>
            {[
              { icon: 'check_circle', label: 'Confirmed', active: true, done: true },
              { icon: 'inventory', label: 'Processing', active: true, done: false },
              { icon: 'local_shipping', label: 'Shipping', active: false, done: false },
              { icon: 'home', label: 'Delivered', active: false, done: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 z-10 hover:scale-105 transition-transform cursor-default">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  step.done
                    ? 'bg-primary border-primary text-on-primary shadow-[0_0_15px_rgba(185,199,228,0.4)]'
                    : step.active
                    ? 'bg-surface-container border-primary text-primary shadow-[0_0_10px_rgba(185,199,228,0.2)]'
                    : 'bg-surface-container border-outline-variant/30 text-outline-variant'
                }`}>
                  <span className={`material-symbols-outlined text-[20px] ${step.active && !step.done ? 'animate-pulse' : ''}`} style={step.done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {step.icon}
                  </span>
                </div>
                <span className={`font-label-sm text-[11px] uppercase tracking-widest transition-colors ${step.done || step.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/account"
            className="px-8 py-3.5 bg-primary text-on-primary font-label-md rounded-lg glow-primary hover:glow-primary-hover transition-all flex items-center justify-center gap-3 btn-ripple font-bold uppercase tracking-widest text-[12px]"
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            Track Protocol
          </Link>
          <Link
            to="/products"
            className="px-8 py-3.5 bg-surface-bright text-on-surface border border-outline-variant/50 font-label-md rounded-lg hover:border-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-3 btn-ripple uppercase tracking-widest text-[12px]"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Continue Browsing
          </Link>
        </div>

        {/* Decorative tech readout */}
        <div className="mt-12 grid grid-cols-3 gap-8 opacity-50 w-full hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1 group">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Status</span>
            <span className="font-body-md text-on-surface font-mono text-sm group-hover:text-primary transition-colors">CONFIRMED</span>
          </div>
          <div className="flex flex-col items-center gap-1 group">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Session</span>
            <span className="font-body-md text-on-surface font-mono text-sm flex items-center gap-2 group-hover:text-primary transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> SECURE
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 group">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Latency</span>
            <span className="font-body-md text-on-surface font-mono text-sm group-hover:text-primary transition-colors">&lt;12ms</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
