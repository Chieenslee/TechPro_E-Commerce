import React from 'react';

const Policies = () => {
  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl page-enter">
      {/* Header Section */}
      <header className="mb-lg text-center max-w-3xl mx-auto fade-in-up">
        <h1 className="font-headline-xl text-primary mb-base text-glow">Service & Policies</h1>
        <p className="font-body-lg text-on-surface-variant leading-relaxed">Precision Engineering extends beyond hardware. Review our operational protocols and client service agreements.</p>
      </header>
      
      {/* Bento Grid Layout for Policies */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter stagger-children">
        {/* Warranty Policy (Large Card) */}
        <section className="md:col-span-8 glass border border-outline-variant/30 hover:border-primary/50 transition-colors duration-300 p-lg flex flex-col justify-between rounded-3xl relative overflow-hidden group hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-md">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <h2 className="font-headline-lg text-on-surface group-hover:text-primary transition-colors">Warranty Protocol</h2>
            </div>
            <p className="font-body-md text-on-surface-variant mb-md max-w-2xl leading-relaxed">
              Our hardware is engineered to exacting standards. All TechPro devices are covered by a comprehensive 24-month limited warranty against manufacturing defects and material failures under normal operational conditions.
            </p>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 bg-primary/10 rounded-full p-0.5">check_circle</span>
                <span>Direct hardware replacement for catastrophic system failure within 30 days.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 bg-primary/10 rounded-full p-0.5">check_circle</span>
                <span>Expedited component repair via authorized service nodes.</span>
              </li>
              <li className="flex items-start gap-3 opacity-70">
                <span className="material-symbols-outlined text-outline-variant text-[20px] mt-0.5 border border-outline-variant/50 rounded-full p-0.5">remove</span>
                <span>Excludes liquid damage, unauthorized modifications, and extreme environmental exposure.</span>
              </li>
            </ul>
          </div>
          <div className="mt-xl relative z-10">
            <button className="bg-surface-container border border-primary text-primary px-8 py-3.5 rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-3 btn-ripple font-bold uppercase tracking-widest text-[12px]">
              View Full Terms
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
        
        {/* Shipping Policy (Tall Card) */}
        <section className="md:col-span-4 glass border border-outline-variant/30 rounded-3xl p-lg flex flex-col hover-lift hover:border-secondary/50 transition-colors group">
          <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
          <div className="flex items-center gap-4 mb-md relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 text-secondary group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <h2 className="font-headline-md text-on-surface group-hover:text-secondary transition-colors">Shipping Logic</h2>
          </div>
          <p className="font-body-md text-on-surface-variant mb-lg flex-grow leading-relaxed relative z-10">
            Optimized logistics network ensuring secure and rapid deployment of your hardware globally.
          </p>
          <div className="space-y-4 relative z-10">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <h3 className="font-label-md text-on-surface mb-2 uppercase tracking-widest text-[11px] text-secondary">Standard Deployment</h3>
              <p className="font-body-md text-on-surface-variant">3-5 operational days. Complimentary on orders over $500.</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 hover:border-secondary/30 transition-colors">
              <h3 className="font-label-md text-on-surface mb-2 uppercase tracking-widest text-[11px] text-secondary">Priority Node Routing</h3>
              <p className="font-body-md text-on-surface-variant">Next-day delivery available in select technical hubs.</p>
            </div>
          </div>
        </section>
        
        {/* Return & Exchange */}
        <section className="md:col-span-6 glass border border-outline-variant/30 rounded-3xl p-lg hover-lift hover:border-tertiary/50 transition-colors group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="flex items-center gap-4 mb-md relative z-10">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20 text-tertiary group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-[24px]">sync_alt</span>
            </div>
            <h2 className="font-headline-md text-on-surface group-hover:text-tertiary transition-colors">RMA Protocol</h2>
          </div>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed relative z-10">
            If the equipment does not meet your operational requirements, initiate a Return Merchandise Authorization (RMA) within 14 days of receipt.
          </p>
          <p className="font-body-md text-on-surface-variant text-sm bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 relative z-10 leading-relaxed">
            Items must remain in factory condition with all original shielding and diagnostic packaging intact. Restocking fees may apply to customized arrays.
          </p>
        </section>
        
        {/* Privacy Policy */}
        <section className="md:col-span-6 glass border border-outline-variant/30 rounded-3xl p-lg hover-lift hover:border-error/50 transition-colors group relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-tl from-error/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="flex items-center gap-4 mb-md relative z-10">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center border border-error/20 text-error group-hover:bg-error/20 transition-colors">
              <span className="material-symbols-outlined text-[24px]">shield_lock</span>
            </div>
            <h2 className="font-headline-md text-on-surface group-hover:text-error transition-colors">Security Protocol</h2>
          </div>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed relative z-10">
            Your telemetry and diagnostic data are encrypted end-to-end. We do not broker client operational data to third-party entities.
          </p>
          <a className="font-label-md text-primary hover:text-primary-fixed transition-colors flex items-center gap-2 mt-auto w-fit uppercase tracking-widest text-[12px] relative z-10 font-bold bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 hover:bg-primary hover:text-on-primary" href="#">
            Review Privacy Manifesto
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
        </section>
      </div>
      
      {/* Contact Support CTA */}
      <section className="mt-xl glass border border-primary/30 rounded-3xl p-xl text-center flex flex-col items-center shadow-[0_0_30px_rgba(185,199,228,0.1)] relative overflow-hidden fade-in-up hover-lift">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="w-20 h-20 rounded-2xl bg-surface-container border border-primary/50 flex items-center justify-center text-primary mb-lg z-10 shadow-[0_0_20px_rgba(185,199,228,0.2)] animate-pulse glow-primary">
          <span className="material-symbols-outlined text-[40px]">support_agent</span>
        </div>
        <h2 className="font-headline-lg text-on-surface mb-md z-10 text-glow">Require Technical Assistance?</h2>
        <p className="font-body-lg text-on-surface-variant mb-xl max-w-2xl z-10 leading-relaxed">
          Our elite engineering support nodes are on standby 24/7 to resolve hardware integration issues or clarify protocol specifics.
        </p>
        <button className="bg-primary text-on-primary px-10 py-4 rounded-xl font-label-md transition-all duration-300 z-10 btn-ripple glow-primary hover:glow-primary-hover font-bold uppercase tracking-widest text-[13px] flex items-center gap-3">
          Initiate Support Ticket
          <span className="material-symbols-outlined">send</span>
        </button>
      </section>
    </main>
  );
};

export default Policies;
