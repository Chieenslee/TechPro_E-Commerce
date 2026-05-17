
const Contact = () => {
  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl page-enter">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-md fade-in-up">
        <h1 className="font-headline-xl text-primary text-glow">Initialize Contact</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Engage with our engineering and support teams. Precision assistance for your high-performance hardware.
        </p>
      </section>
      
      {/* Bento Grid Layout for Contact & Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Contact Details Panel */}
        <div className="lg:col-span-4 flex flex-col gap-gutter stagger-children">
          <div className="glass border border-outline-variant/30 rounded-2xl p-lg shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="flex items-center gap-sm text-primary">
                <span className="material-symbols-outlined bg-primary/10 p-2 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">call</span>
                <h3 className="font-headline-md">Hotline</h3>
              </div>
              <p className="font-body-md text-on-surface-variant font-mono text-[13px] uppercase tracking-wider mt-2">24/7 Global Support</p>
              <a className="font-headline-lg text-on-surface hover:text-primary transition-colors mt-xs font-bold tracking-tight text-glow" href="tel:+1800TECHPRO">+1 800 TECHPRO</a>
            </div>
          </div>
          
          <div className="glass border border-outline-variant/30 rounded-2xl p-lg shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="flex items-center gap-sm text-secondary">
                <span className="material-symbols-outlined bg-secondary/10 p-2 rounded-lg border border-secondary/20 group-hover:bg-secondary/20 transition-colors">mail</span>
                <h3 className="font-headline-md">Email</h3>
              </div>
              <p className="font-body-md text-on-surface-variant font-mono text-[13px] uppercase tracking-wider mt-2">Direct Inquiry Channel</p>
              <a className="font-body-lg text-on-surface hover:text-secondary transition-colors mt-xs break-all font-mono" href="mailto:support@techpro.eng">support@techpro.eng</a>
            </div>
          </div>
          
          <div className="glass border border-outline-variant/30 rounded-2xl p-lg shadow-sm relative overflow-hidden group hover:border-tertiary/50 transition-colors duration-300 hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="flex items-center gap-sm text-tertiary">
                <span className="material-symbols-outlined bg-tertiary/10 p-2 rounded-lg border border-tertiary/20 group-hover:bg-tertiary/20 transition-colors">location_on</span>
                <h3 className="font-headline-md">HQ Address</h3>
              </div>
              <p className="font-body-md text-on-surface-variant font-mono text-[13px] uppercase tracking-wider mt-2">Silicon Valley Operations</p>
              <address className="font-body-md text-on-surface not-italic mt-xs leading-relaxed bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 mt-2">
                1001 Tech Boulevard<br />
                San Jose, CA 95134<br />
                United States
              </address>
            </div>
          </div>
        </div>
        
        {/* Inquiry Form Panel */}
        <div className="lg:col-span-8 glass border border-outline-variant/30 rounded-3xl p-xl shadow-sm relative overflow-hidden fade-in-up group hover:border-primary/30 transition-colors" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform duration-700" style={{ fontSize: '180px' }}>terminal</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="font-headline-lg text-on-surface mb-lg flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(185,199,228,0.5)]"></span>
              Transmission Form
            </h2>
            <form className="flex flex-col gap-lg" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-2 relative group/input">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]" htmlFor="firstName">First Name</label>
                  <input className="bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:border-primary/50" id="firstName" type="text" />
                </div>
                <div className="flex flex-col gap-2 relative group/input">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]" htmlFor="lastName">Last Name</label>
                  <input className="bg-surface-container border border-outline-variant/50 rounded-lg p-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:border-primary/50" id="lastName" type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group/input">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]" htmlFor="email">Email Address</label>
                <div className="relative flex items-center">
                   <span className="material-symbols-outlined absolute left-3 text-on-surface-variant group-focus-within/input:text-primary transition-colors">mail</span>
                   <input className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 pl-10 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all tracking-wide hover:border-primary/50" id="email" type="email" />
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group/input">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]" htmlFor="subject">Inquiry Type</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant group-focus-within/input:text-primary transition-colors">category</span>
                  <select className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-3 pl-10 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer hover:border-primary/50" id="subject">
                    <option value="technical">Technical Support</option>
                    <option value="sales">Hardware Sales</option>
                    <option value="rma">RMA & Warranty</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group/input">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]" htmlFor="message">Message Payload</label>
                <textarea className="w-full bg-surface-container border border-outline-variant/50 rounded-lg p-4 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none hover:border-primary/50" id="message" rows={5}></textarea>
              </div>
              <div className="mt-2 flex justify-end">
                <button className="bg-primary text-on-primary font-label-md px-8 py-3.5 rounded-lg transition-all duration-300 uppercase tracking-widest flex items-center gap-3 btn-ripple glow-primary hover:glow-primary-hover font-bold group" type="button">
                  Transmit Data
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="flex flex-col gap-lg mt-xl fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="font-headline-md text-on-surface flex items-center gap-3 text-glow">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg border border-primary/20">public</span>
          Global Logistics Hubs
        </h2>
        <div className="w-full h-[500px] bg-surface-container border border-outline-variant/30 rounded-3xl overflow-hidden relative shadow-[0_0_30px_rgba(185,199,228,0.05)] group glass">
          <img alt="Map view" className="w-full h-full object-cover opacity-60 filter grayscale-[50%] hue-rotate-[200deg] contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-[20s] ease-linear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTWMznxR1TAG1IOZBx9-TlhTdz0ogU50yCNATUp4aJL8lIpmyAxvYnvpghabf81NKwxkw3xPWaW72vVkqcpyJgmyV5y9YHMSr998elXYzBi3xRSONmoVwg9vrW0lG18LHIjE97H_Yp10ZCql0gKrZDdue6Q9D6_LM3Hj0RnFy5ThkOM5CO1aAl3pbmm9kuA9JAutJpRX-cxKOsYBdLYTcZr3wrU9VhK2_pNuuULxSBMZCnY5eOLAiEbJBQIdfC1f4aSzaKbyCgMw6w" />
          
          {/* Tech grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          {/* Simulated Map UI Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
                <span className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></span>
                <span className="absolute -inset-2 bg-primary/40 rounded-full animate-pulse"></span>
                <span className="relative material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
             </div>
          </div>

          <div className="absolute top-lg left-lg bg-surface/80 backdrop-blur-xl border border-primary/30 p-md rounded-xl shadow-[0_0_20px_rgba(185,199,228,0.2)] hover-lift hover:border-primary/80 transition-colors">
            <p className="font-label-sm text-primary text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Primary Node
            </p>
            <p className="font-body-md text-on-surface font-bold text-glow">San Jose, CA HQ</p>
            <p className="font-mono text-[11px] text-on-surface-variant mt-2 border-t border-outline-variant/30 pt-2">LAT 37.3382° N <br/> LNG 121.8863° W</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
