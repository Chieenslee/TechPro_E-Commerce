
const Maintenance = () => {
  return (
    <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10 overflow-hidden page-enter">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(185, 199, 228, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(185, 199, 228, 0.15) 0%, transparent 40%)" }}></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0 shadow-[0_0_15px_rgba(185,199,228,0.5)]"></div>

      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10">
        {/* Left Side: Information & Countdown */}
        <div className="md:col-span-7 lg:col-span-6 flex flex-col gap-lg z-10 fade-in-up">
          {/* Brand Anchor */}
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-[32px] text-primary animate-pulse shadow-[0_0_15px_rgba(185,199,228,0.2)] rounded-full">memory</span>
            <h1 className="font-headline-md font-bold tracking-tight text-primary text-glow">TechPro</h1>
          </div>

          {/* Main Message */}
          <div className="flex flex-col gap-md">
            <div className="inline-flex items-center gap-3 bg-secondary/10 border border-secondary/20 px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]"></span>
              <span className="font-label-sm text-secondary uppercase tracking-widest text-[11px] font-bold">System Update</span>
            </div>
            <h2 className="font-headline-xl text-on-surface text-glow">Scheduled Maintenance</h2>
            <p className="font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Our engineering team is deploying precision upgrades to core infrastructure. This scheduled downtime ensures optimal performance and security protocol enhancements.
            </p>
          </div>

          {/* Countdown Bento Box */}
          <div className="glass rounded-3xl p-xl flex flex-col gap-md border border-outline-variant/30 hover:border-primary/30 transition-colors shadow-[0_0_30px_rgba(185,199,228,0.05)] hover-lift">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-[20px] animate-[spin_10s_linear_infinite]">timer</span>
              <h3 className="font-label-md uppercase tracking-widest text-[11px] font-bold">Estimated Resumption</h3>
            </div>

            <div className="grid grid-cols-4 gap-sm text-center">
              <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-headline-lg text-on-surface font-mono text-glow relative z-10">02</div>
                <div className="font-label-sm text-on-surface-variant mt-1 text-[10px] uppercase tracking-widest relative z-10">HOURS</div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-headline-lg text-on-surface font-mono text-glow relative z-10">45</div>
                <div className="font-label-sm text-on-surface-variant mt-1 text-[10px] uppercase tracking-widest relative z-10">MINUTES</div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-headline-lg text-on-surface font-mono text-glow relative z-10">15</div>
                <div className="font-label-sm text-on-surface-variant mt-1 text-[10px] uppercase tracking-widest relative z-10">SECONDS</div>
              </div>
              <div className="bg-primary/10 rounded-xl p-md border border-primary/20 flex flex-col justify-center items-center">
                <span className="material-symbols-outlined text-[24px] text-primary animate-[spin_2s_linear_infinite]">sync</span>
                <div className="font-label-sm text-primary mt-2 text-[10px] uppercase tracking-widest font-bold">SYNCING</div>
              </div>
            </div>
          </div>

          {/* Subscription Action */}
          <div className="flex flex-col gap-sm mt-4">
            <h4 className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Get notified when systems are online:</h4>
            <div className="flex flex-col sm:flex-row gap-sm group/form">
              <div className="relative flex-grow flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within/form:text-primary transition-colors">mail</span>
                <input type="email" placeholder="Enter engineering ID or email" className="w-full bg-surface-container border border-outline-variant/50 rounded-lg pl-12 pr-4 py-3.5 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 tracking-wide hover:border-primary/50" />
              </div>
              <button className="bg-primary text-on-primary font-label-md px-8 py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 btn-ripple glow-primary hover:glow-primary-hover font-bold uppercase tracking-widest text-[12px] whitespace-nowrap">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Technical Abstract Visual */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-6 justify-center items-center relative h-full min-h-[500px] fade-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Abstract Technical Graphic */}
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center group">
            {/* Central Node */}
            <div className="absolute w-32 h-32 glass border border-primary/40 rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(185,199,228,0.2)] group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[48px] text-primary animate-[spin_4s_linear_infinite]" style={{ fontVariationSettings: "'wght' 200" }}>settings</span>
            </div>
            
            {/* Orbital Rings */}
            <div className="absolute w-64 h-64 border-[2px] border-primary/20 rounded-full z-10 border-dashed animate-[spin_20s_linear_infinite_reverse]"></div>
            <div className="absolute w-96 h-96 border border-outline-variant/20 rounded-full z-0 animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute w-[450px] h-[450px] border border-outline-variant/10 rounded-full z-0 animate-[spin_40s_linear_infinite_reverse]"></div>
            
            {/* Connection Lines / Data Flows */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10 group-hover:scale-x-110 transition-transform duration-700"></div>
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent z-10 group-hover:scale-y-110 transition-transform duration-700"></div>
            
            {/* Tech Spec Tags Floating */}
            <div className="absolute top-[20%] left-[20%] glass px-3 py-1.5 rounded-lg border border-primary/30 font-mono text-[10px] text-primary z-20 shadow-[0_0_15px_rgba(185,199,228,0.1)] animate-bounce" style={{ animationDuration: '3s' }}>
              SYS_UPGRADE_V2.4
            </div>
            <div className="absolute bottom-[25%] right-[20%] glass px-3 py-1.5 rounded-lg border border-secondary/30 font-mono text-[10px] text-secondary z-20 shadow-[0_0_15px_rgba(0,255,255,0.1)] flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              DB_MIGRATION
            </div>
             <div className="absolute top-[30%] right-[15%] glass px-3 py-1.5 rounded-lg border border-tertiary/30 font-mono text-[10px] text-tertiary z-20 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              NODE_SYNCING
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Maintenance;
