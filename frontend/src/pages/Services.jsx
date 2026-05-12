import React from 'react';

const Services = () => {
  return (
    <main className="flex-grow flex flex-col items-center w-full page-enter">
      {/* Hero Section */}
      <section className="w-full max-w-[1440px] px-margin-mobile md:px-margin-desktop py-xl flex flex-col md:flex-row items-center gap-xl">
        <div className="flex-1 flex flex-col gap-md fade-in-up">
          <div className="inline-flex items-center gap-xs bg-primary/10 border border-primary/30 px-sm py-xs rounded-full w-fit hover:bg-primary/20 transition-colors cursor-default">
            <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="font-label-sm text-primary uppercase tracking-widest text-[11px]">Premium Protection</span>
          </div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">Precision Engineering.<br /><span className="text-primary text-glow">Unwavering Protection.</span></h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            TechPro Care is the ultimate safeguard for your high-performance hardware. Extended warranty, 24/7 priority support, and comprehensive accidental damage coverage designed for professionals who demand zero downtime.
          </p>
          <div className="flex flex-wrap gap-md mt-sm">
            <button className="bg-primary text-on-primary font-label-md px-8 py-3.5 rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 btn-ripple glow-primary hover:glow-primary-hover font-bold">
              Secure Coverage
            </button>
            <button className="bg-surface-bright border border-outline-variant/50 hover:border-primary text-on-surface font-label-md px-8 py-3.5 rounded-lg hover:bg-primary/10 transition-all duration-300 btn-ripple">
              View Terms
            </button>
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_30px_rgba(185,199,228,0.1)] fade-in">
          <img alt="TechPro Hardware" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[10s] ease-linear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDIR9B-Hh6-P-mb1g9TZLroD800Ya2VwnHjnCdaIaHsQk3nFWCYvhZRQSwpwqMBUjiGNkTgSFkReTLS9R-N7ox4gkjL5q1EUrLo6IEnMEKrXZyWCH0VWn9FG9G25MFBossAa460MwlqVIIeZXvg2oSUbleHEB3BzMl4HLkP1DlzCSZmvr1Lw1rjV9dCuLoeMKjb6oG_AENck1j00cnWVLdD7ICyuO8h3d-vi59tGBogtl5CD4JI3DP6182ST-Ke3tS898Fwznh1uww" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          {/* Tech Scanner Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-50 shadow-[0_0_15px_rgba(185,199,228,1)] animate-[scanner_3s_ease-in-out_infinite]"></div>
        </div>
      </section>

      {/* Benefits Grid (Bento Style) */}
      <section className="w-full max-w-[1440px] px-margin-mobile md:px-margin-desktop py-xl fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="font-headline-lg text-on-surface mb-xl text-center text-glow">Engineered for Peace of Mind</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter stagger-children">
          {/* Benefit 1 */}
          <div className="col-span-1 md:col-span-2 glass border border-outline-variant/30 rounded-2xl p-xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-300 hover-lift">
            <div className="absolute top-0 right-0 p-lg opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <span className="material-symbols-outlined text-[120px] text-primary group-hover:rotate-12 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 0" }}>support_agent</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-lg border border-primary/30 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
                </div>
                <h3 className="font-headline-md text-on-surface mb-sm group-hover:text-primary transition-colors">24/7 Priority Support</h3>
                <p className="font-body-md text-on-surface-variant max-w-md leading-relaxed">
                  Direct access to Level 3 engineering support. Bypass the standard queue and connect immediately with experts who understand your specific hardware configuration.
                </p>
              </div>
            </div>
          </div>
          {/* Benefit 2 */}
          <div className="col-span-1 glass border border-outline-variant/30 rounded-2xl p-lg relative overflow-hidden group hover:border-[#00E5FF]/50 transition-colors duration-300 hover-lift">
            <div className="bg-[#00E5FF]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-md border border-[#00E5FF]/20 group-hover:bg-[#00E5FF]/20 transition-colors">
              <span className="material-symbols-outlined text-[#00E5FF] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            </div>
            <h3 className="font-headline-md text-on-surface mb-sm group-hover:text-[#00E5FF] transition-colors">Accidental Damage</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Comprehensive coverage for drops, spills, and electrical surges. We repair or replace without interrogation.
            </p>
          </div>
          {/* Benefit 3 */}
          <div className="col-span-1 glass border border-outline-variant/30 rounded-2xl p-lg relative overflow-hidden group hover:border-secondary/50 transition-colors duration-300 hover-lift">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-md border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
            </div>
            <h3 className="font-headline-md text-on-surface mb-sm group-hover:text-secondary transition-colors">Annual Health Checks</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Proactive diagnostic deep-scans and physical cleaning by certified technicians to maintain peak thermal performance.
            </p>
          </div>
          {/* Benefit 4 */}
          <div className="col-span-1 md:col-span-2 glass border border-outline-variant/30 rounded-2xl p-lg relative overflow-hidden group hover:border-error/50 transition-colors duration-300 flex items-center gap-lg hover-lift">
            <div className="flex-1">
              <div className="bg-error/10 w-14 h-14 rounded-xl flex items-center justify-center mb-md border border-error/20 group-hover:bg-error/20 transition-colors">
                <span className="material-symbols-outlined text-error text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-sm group-hover:text-error transition-colors">Advance Replacement</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                If your hardware fails, we ship a replacement unit overnight before receiving your defective device, minimizing your downtime to hours, not weeks.
              </p>
            </div>
            <div className="hidden md:flex justify-center items-center w-32 h-32 rounded-full border-4 border-surface border-t-error animate-[spin_4s_linear_infinite] shadow-[0_0_15px_rgba(255,84,73,0.2)]">
                <span className="material-symbols-outlined text-error text-[40px] animate-[spin_4s_linear_infinite_reverse]">sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-surface-container-lowest py-xl border-t border-outline-variant/30 fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="max-w-[1440px] px-margin-mobile md:px-margin-desktop mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-on-surface mb-sm text-glow">Select Your Protection Tier</h2>
            <p className="font-body-md text-on-surface-variant">Transparent pricing. No hidden diagnostic fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-4xl mx-auto stagger-children">
            {/* Standard Tier */}
            <div className="glass border border-outline-variant/30 rounded-3xl p-lg flex flex-col h-full relative hover-lift hover:border-primary/30 transition-colors">
              <div className="mb-lg">
                <h3 className="font-headline-md text-on-surface">Standard</h3>
                <div className="flex items-end gap-2 mt-sm mb-md">
                  <span className="font-headline-xl text-on-surface font-bold">$99</span>
                  <span className="font-body-md text-on-surface-variant mb-2">/year</span>
                </div>
                <p className="font-body-md text-on-surface-variant">Essential coverage for standard operational use.</p>
              </div>
              <ul className="flex flex-col gap-4 mb-xl flex-grow">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5">check_circle</span>
                  <span className="font-body-md text-on-surface">2-Year Extended Warranty</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5">check_circle</span>
                  <span className="font-body-md text-on-surface">Business Hours Support</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">cancel</span>
                  <span className="font-body-md text-on-surface-variant line-through">Accidental Damage</span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">cancel</span>
                  <span className="font-body-md text-on-surface-variant line-through">Advance Replacement</span>
                </li>
              </ul>
              <button className="w-full bg-surface-bright border border-outline-variant/50 hover:border-primary text-on-surface font-label-md px-md py-3 rounded-xl hover:bg-primary/10 transition-colors btn-ripple">
                Select Standard
              </button>
            </div>
            
            {/* Pro Tier */}
            <div className="glass border-[2px] border-primary/50 rounded-3xl p-lg flex flex-col h-full relative shadow-[0_0_30px_rgba(185,199,228,0.15)] hover-lift">
              <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-sm px-4 py-1.5 rounded-bl-xl rounded-tr-3xl font-bold uppercase tracking-widest text-[10px] shadow-[0_4px_10px_rgba(185,199,228,0.3)]">
                Recommended
              </div>
              <div className="mb-lg">
                <h3 className="font-headline-md text-primary text-glow">Pro</h3>
                <div className="flex items-end gap-2 mt-sm mb-md">
                  <span className="font-headline-xl text-on-surface font-bold">$249</span>
                  <span className="font-body-md text-on-surface-variant mb-2">/year</span>
                </div>
                <p className="font-body-md text-on-surface-variant">Comprehensive protection for mission-critical hardware.</p>
              </div>
              <ul className="flex flex-col gap-4 mb-xl flex-grow">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-md text-on-surface">3-Year Extended Warranty</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-md text-on-surface">24/7 Priority Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-md text-on-surface">Accidental Damage Protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-md text-on-surface">Overnight Advance Replacement</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-md text-on-surface">Annual Health Checks</span>
                </li>
              </ul>
              <button className="w-full bg-primary text-on-primary font-label-md px-md py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 btn-ripple glow-primary hover:glow-primary-hover font-bold relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-[150%] group-hover:animate-[ticker_1s_ease-in-out]"></div>
                Select Pro
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
