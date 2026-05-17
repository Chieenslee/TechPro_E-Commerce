
const About = () => {
  return (
    <main className="flex-grow page-enter">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Abstract high-tech background" className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiu5itCRhNvho_p9H_xc1Kr59wacSCiaCCEH1uhTgOGWqHQSOgZXvXi-DH8lVyFM9Ro2tnP4uOBhNXt8MwH6LunAccBRQQVZ5it8QWYeVmO2QbQRqG1zhAE0dYzSX-vdE0ml4JrtxUHvQ7vrOrrvZbZmr8aSaxn9-F6U0yaHwMeGLz3nrw64IHyLoi4ajgUTz4JaNsHyJfoVBHIh8lsXcJp1igrwkCQoDgXbwmXK3zhvQxDsef7UKm2i3U_Pt-5EMW-YBBVi1FxLaA" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] w-full px-margin-mobile md:px-margin-desktop text-center fade-in-up">
          <h1 className="font-headline-xl text-primary mb-6 text-glow">Precision Built. Performance Driven.</h1>
          <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
            At TechPro, we engineer premium technology solutions for those who demand excellence. Our commitment to cutting-edge design and flawless execution ensures every interaction feels like a high-performance instrument.
          </p>
          <button className="bg-primary text-on-primary font-label-md px-8 py-4 rounded shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 font-bold uppercase tracking-wider btn-ripple glow-primary hover:glow-primary-hover">
            Explore Our Ecosystem
          </button>
        </div>
      </section>
      
      {/* Company Story (Bento Grid) */}
      <section className="py-xl max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-lg">
          <h2 className="font-headline-lg text-primary mb-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-[32px]">architecture</span>
            The Architecture of Innovation
          </h2>
          <div className="h-1 w-20 bg-primary mb-6 shadow-[0_0_10px_rgba(0,229,255,0.8)]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter stagger-children">
          {/* Large Story Card */}
          <div className="md:col-span-8 rounded-2xl p-8 lg:p-12 relative overflow-hidden group glass border border-outline-variant/30 hover:border-primary/50 transition-colors hover-lift">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-colors duration-700"></div>
            <h3 className="font-headline-md text-on-surface mb-6 text-glow">Forged in Silicon</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
              Founded in 2010 by a collective of aerospace engineers and industrial designers, TechPro emerged from a singular vision: to bridge the gap between industrial-grade reliability and consumer electronics aesthetics. We don't just assemble components; we architect systems from the atomic level up.
            </p>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Every product in our catalog undergoes rigorous thermal stress testing and component validation, ensuring that what you hold in your hand is not merely a gadget, but a meticulously calibrated tool designed for the modern professional.
            </p>
          </div>
          {/* Stats Vertical Stack */}
          <div className="md:col-span-4 flex flex-col gap-gutter">
            <div className="rounded-2xl p-8 flex-grow flex flex-col justify-center items-center text-center glass border border-outline-variant/30 hover-lift group">
              <div className="font-headline-xl text-primary mb-2 text-glow group-hover:scale-110 transition-transform duration-500">99.9%</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-widest group-hover:text-on-surface transition-colors">Hardware Reliability</div>
            </div>
            <div className="rounded-2xl p-8 flex-grow flex flex-col justify-center items-center text-center glass border border-outline-variant/30 hover-lift group">
              <div className="font-headline-xl text-primary mb-2 text-glow group-hover:scale-110 transition-transform duration-500">14+</div>
              <div className="font-label-sm text-on-surface-variant uppercase tracking-widest group-hover:text-on-surface transition-colors">Years of Engineering</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-xl bg-surface-container-lowest border-y border-outline-variant/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-primary mb-4 text-glow">Core Operating Principles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter stagger-children">
            {/* Value 1 */}
            <div className="rounded-2xl p-8 glass border border-outline-variant/30 hover-lift group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-8 relative group-hover:border-primary transition-colors bg-surface-container">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse group-hover:bg-primary/20 transition-colors"></div>
                <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'wght' 200" }}>my_location</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-4 group-hover:text-primary transition-colors">Precision</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Tolerances measured in microns. We believe that exactitude is the foundation of reliability. Every physical edge and digital interface is calculated for optimal performance.
              </p>
            </div>
            {/* Value 2 */}
            <div className="rounded-2xl p-8 glass border border-outline-variant/30 hover-lift group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-8 relative group-hover:border-primary transition-colors bg-surface-container">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse group-hover:bg-primary/20 transition-colors" style={{ animationDelay: '300ms' }}></div>
                <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'wght' 200" }}>lightbulb</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-4 group-hover:text-primary transition-colors">Innovation</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Iterative refinement meets paradigm-shifting technology. We continuously push the boundaries of material science and software integration to deliver next-generation solutions.
              </p>
            </div>
            {/* Value 3 */}
            <div className="rounded-2xl p-8 glass border border-outline-variant/30 hover-lift group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-8 relative group-hover:border-primary transition-colors bg-surface-container">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse group-hover:bg-primary/20 transition-colors" style={{ animationDelay: '600ms' }}></div>
                <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'wght' 200" }}>group</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-4 group-hover:text-primary transition-colors">Customer Centric</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Engineered for the user, not just the spec sheet. Our design process begins and ends with the human experience, ensuring seamless integration into your professional workflow.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Authorized Partnerships */}
      <section className="py-xl max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="font-headline-lg text-primary mb-2 text-glow">Authorized Integrations</h2>
            <p className="font-body-md text-on-surface-variant">Strategic alliances with industry leaders.</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-block px-3 py-1 text-[10px] font-mono border border-primary/50 text-primary uppercase tracking-wider rounded bg-primary/10">Tier 1 Partners</span>
            <span className="inline-block px-3 py-1 text-[10px] font-mono border border-outline-variant/50 text-on-surface-variant uppercase tracking-wider rounded">Certified</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 hover:opacity-100 transition-opacity duration-500 stagger-children">
          <div className="h-28 flex items-center justify-center rounded-xl hover:border-primary transition-colors glass border border-outline-variant/30 hover-lift cursor-pointer group">
            <div className="flex items-center gap-3 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>memory</span>
              <span>QUANTUM</span>
            </div>
          </div>
          <div className="h-28 flex items-center justify-center rounded-xl hover:border-primary transition-colors glass border border-outline-variant/30 hover-lift cursor-pointer group">
            <div className="flex items-center gap-3 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>router</span>
              <span>NEXUS</span>
            </div>
          </div>
          <div className="h-28 flex items-center justify-center rounded-xl hover:border-primary transition-colors glass border border-outline-variant/30 hover-lift cursor-pointer group">
            <div className="flex items-center gap-3 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>database</span>
              <span>AEGIS</span>
            </div>
          </div>
          <div className="h-28 flex items-center justify-center rounded-xl hover:border-primary transition-colors glass border border-outline-variant/30 hover-lift cursor-pointer group">
            <div className="flex items-center gap-3 text-on-surface font-bold tracking-widest group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 200" }}>terminal</span>
              <span>SYNTAX</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
