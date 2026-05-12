import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] page-enter px-margin-mobile md:px-margin-desktop bg-surface relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(185,199,228,0.15)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-md w-full glass p-xl rounded-3xl border border-outline-variant/30 text-center flex flex-col items-center gap-md relative z-10 fade-in-up hover-lift shadow-[0_0_40px_rgba(185,199,228,0.05)]">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-sm shadow-inner border border-outline-variant/50 relative group">
            <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/50 animate-[spin_4s_linear_infinite] transition-all"></div>
            <span className="material-symbols-outlined text-primary text-[40px] opacity-80" style={{ fontVariationSettings: "'wght' 200" }}>lock_person</span>
          </div>
          
          <h1 className="font-headline-lg text-on-surface text-glow">Authentication Required</h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-sm">
            You must initialize a secure session to access the control panel, order telemetry, and your personalized data node.
          </p>
          
          <div className="flex flex-col w-full gap-3 mt-sm">
            <Link to="/login" className="w-full py-3 bg-primary text-on-primary font-label-md rounded-lg glow-primary glow-primary-hover transition-all flex justify-center items-center gap-2 btn-ripple group overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-[150%] group-hover:animate-[ticker_1s_ease-in-out]"></div>
              <span className="material-symbols-outlined text-[20px] z-10">login</span>
              <span className="z-10 uppercase tracking-wider text-[12px] font-bold">Initialize Link</span>
            </Link>
            
            <Link to="/login" state={{ mode: 'register' }} className="w-full py-3 bg-surface border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md rounded-lg transition-all flex justify-center items-center gap-2 btn-ripple">
              <span className="uppercase tracking-wider text-[12px] font-bold">Create Identity</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row page-enter">
      {/* Side Dashboard Navigation */}
      <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-outline-variant/30 bg-surface-container-lowest flex flex-col py-lg px-md lg:min-h-[calc(100vh-80px)] sticky top-20 z-10 fade-in-up">
        <h2 className="font-label-md text-primary mb-md px-sm flex items-center gap-2 tracking-widest text-[12px] uppercase">
          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span> Control Panel
        </h2>
        <nav className="flex flex-col gap-2">
          {[
            { id: 'profile', icon: 'person', label: 'Profile Overview' },
            { id: 'orders', icon: 'receipt_long', label: 'Order History' },
            { id: 'wishlist', icon: 'favorite', label: 'Wishlist' },
            { id: 'address', icon: 'location_on', label: 'Address Book' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(185,199,228,0.1)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 border border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-label-md">{item.label}</span>
            </button>
          ))}
          <div className="my-sm border-t border-outline-variant/30 w-full"></div>
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-error hover:text-on-error-container hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md">Terminate Session</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div key={activeTab} className="fade-in">
          {activeTab === 'profile' && (
            <div className="grid gap-xl stagger-children">
              {/* Dashboard Header & Profile Overview */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                <div className="col-span-1 md:col-span-12 flex justify-between items-end">
                  <h1 className="font-headline-lg text-on-surface text-glow">Dashboard</h1>
                  <span className="font-mono text-primary text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">SESSION: SECURE</span>
                </div>
                
                <div className="col-span-1 md:col-span-8 rounded-2xl p-lg flex flex-col sm:flex-row items-center sm:items-start gap-lg glass border border-primary/20 hover-lift shadow-[0_0_20px_rgba(185,199,228,0.05)]">
                  <div className="w-32 h-32 rounded-full border-[3px] border-primary/50 overflow-hidden flex-shrink-0 relative group shadow-[0_0_15px_rgba(185,199,228,0.3)]">
                    <div className="w-full h-full bg-surface-container flex items-center justify-center bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsf4APjKLjIth74Qt9yskPmX2ALUOVGz0HRF00aTZLWginjnJ3w0_HFveHIosDIL7rtKxUeIcDzMj6w0mI3QuGdIFfLsEhGdYOwjYVGvFi379oj90u3lk_iLm-Jo2iO3XCdpi3lHcyqCh8n260XhrppRZlnM6smc7aYk9L1B04GhO7kId2AgTp_DxyvaI6pXwuUiwxj-BP1MRtaY1lyuH6Ht0S_3h657MTSHsIt3HXm4WbyuhZe3qnZUrYRKdAlxHQI50LjOHxLwHW')" }}></div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="font-headline-md text-on-surface">Alex Mercer</h2>
                    <p className="font-body-md text-on-surface-variant mt-xs font-mono text-sm">alex.mercer@techpro.com</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg font-label-sm text-primary uppercase tracking-wider shadow-[0_0_10px_rgba(185,199,228,0.2)]">
                        <span className="material-symbols-outlined text-[16px]">stars</span> Platinum Tier
                      </span>
                      <span className="font-body-md text-on-surface-variant sm:border-l sm:border-outline-variant/30 sm:pl-4">Telemetry Points: <strong className="text-primary font-mono text-glow">12,450</strong></span>
                    </div>
                  </div>
                  <button className="hidden md:flex border border-outline-variant/50 hover:border-primary text-on-surface px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors font-label-md btn-ripple">Edit Profile</button>
                </div>
                
                {/* Saved Address Quick View */}
                <div className="col-span-1 md:col-span-4 rounded-2xl p-lg flex flex-col justify-between glass border border-outline-variant/30 hover-lift">
                  <div>
                    <div className="flex justify-between items-start mb-md">
                      <h3 className="font-body-lg text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-full text-[18px]">home_pin</span> 
                        Primary Node
                      </h3>
                      <button className="text-primary hover:underline font-label-sm">Manage</button>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 mb-3">
                      <p className="font-body-md text-on-surface font-medium mb-1">Sector 7G Residence</p>
                      <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                        Apt 4B, 128 Tech Boulevard<br/>
                        Cyber District, Neo City 90210
                      </p>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant flex items-center gap-2 font-mono text-sm">
                    <span className="material-symbols-outlined text-[16px]">phone_iphone</span> +1 (555) 019-8234
                  </p>
                </div>
              </section>

              {/* Recent Orders Overview */}
              <section className="mt-xl">
                <div className="flex justify-between items-end mb-md">
                  <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span> Recent Deployments
                  </h2>
                  <button onClick={() => setActiveTab('orders')} className="font-label-md text-primary hover:underline">View All</button>
                </div>
                <div className="glass rounded-xl overflow-hidden overflow-x-auto border border-outline-variant/30">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-surface-container border-b border-outline-variant/30">
                      <tr>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Protocol ID</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Timestamp</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Status</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Total</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 font-body-md text-on-surface">
                      <tr className="hover:bg-surface-bright transition-colors group">
                        <td className="py-4 px-md font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#TP-2024-8932</td>
                        <td className="py-4 px-md text-on-surface-variant">Oct 24, 2024</td>
                        <td className="py-4 px-md">
                          <span className="inline-flex items-center gap-2 text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full text-sm border border-[#00E5FF]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span> Processing
                          </span>
                        </td>
                        <td className="py-4 px-md font-bold">$2,499.00</td>
                        <td className="py-4 px-md text-right">
                          <button className="text-primary hover:bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-lg text-sm transition-colors btn-ripple">Detail</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="fade-in-up">
               <h1 className="font-headline-lg text-on-surface mb-lg text-glow">Order History</h1>
               <div className="glass rounded-xl overflow-hidden overflow-x-auto border border-outline-variant/30">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-surface-container border-b border-outline-variant/30">
                      <tr>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Protocol ID</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Timestamp</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Status</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">Total</th>
                        <th className="py-4 px-md font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20 font-body-md text-on-surface">
                      <tr className="hover:bg-surface-bright transition-colors group">
                        <td className="py-4 px-md font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#TP-2024-8932</td>
                        <td className="py-4 px-md text-on-surface-variant">Oct 24, 2024</td>
                        <td className="py-4 px-md">
                          <span className="inline-flex items-center gap-2 text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full text-sm border border-[#00E5FF]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span> Processing
                          </span>
                        </td>
                        <td className="py-4 px-md font-bold">$2,499.00</td>
                        <td className="py-4 px-md text-right">
                          <button className="text-primary hover:bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-lg text-sm transition-colors btn-ripple">Detail</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-bright transition-colors group">
                        <td className="py-4 px-md font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#TP-2024-8501</td>
                        <td className="py-4 px-md text-on-surface-variant">Sep 12, 2024</td>
                        <td className="py-4 px-md">
                          <span className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Delivered
                          </span>
                        </td>
                        <td className="py-4 px-md font-bold">$129.99</td>
                        <td className="py-4 px-md text-right">
                          <button className="text-on-surface-variant hover:text-on-surface border border-outline-variant/50 hover:border-primary px-4 py-1.5 rounded-lg text-sm transition-colors btn-ripple">Detail</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-bright transition-colors group">
                        <td className="py-4 px-md font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#TP-2024-7210</td>
                        <td className="py-4 px-md text-on-surface-variant">Aug 05, 2024</td>
                        <td className="py-4 px-md">
                           <span className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm border border-primary/20">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Delivered
                          </span>
                        </td>
                        <td className="py-4 px-md font-bold">$849.50</td>
                        <td className="py-4 px-md text-right">
                          <button className="text-on-surface-variant hover:text-on-surface border border-outline-variant/50 hover:border-primary px-4 py-1.5 rounded-lg text-sm transition-colors btn-ripple">Detail</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="fade-in-up">
              <h1 className="font-headline-lg text-on-surface mb-lg text-glow">Wishlist</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter stagger-children">
                {/* Product Card 1 */}
                <div className="glass rounded-xl p-sm group relative overflow-hidden border border-outline-variant/30 hover:border-primary/50 transition-colors hover-lift">
                  <div className="aspect-[4/3] bg-surface-container rounded-lg mb-sm relative flex items-center justify-center p-sm overflow-hidden">
                    <button className="absolute top-3 right-3 text-error bg-surface/80 backdrop-blur p-1.5 rounded-full z-10 shadow hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                    <img alt="Smartphone" className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsa5ZHbjDj6D7qUvcVxGCYNiOyjb-Q8zUTTtKu8gI0Kg-UcJztDCo7PWpbMIvzhxi5-x0JtR4ali2KwMskPeO-9_MRj-8Imsdwlr5rcrOhwx-P7hEQuVXwL5wh6mWjHnz10f-S4PO3ooQmLHszcn-aXyRDN2XnAOXg9BrjQhUxkBskEb-gw0kZlWbP8wCeJrkpeBMPGM1kqlqoRQU2EkK3zDv1I7BjloJbfkc6r0bkvnFlJ5ScVx5jgAfP16n76FQVblnOtEPVEUI6" />
                  </div>
                  <div className="px-xs pb-xs">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Phone</span>
                    <h3 className="font-body-lg text-on-surface truncate font-semibold mb-2 group-hover:text-primary transition-colors">Quantum Pro X</h3>
                    <div className="flex items-center justify-between mt-xs">
                      <span className="font-headline-md font-bold text-primary">$999</span>
                      <button className="text-primary hover:bg-primary text-primary hover:text-on-primary border border-primary/30 p-2 rounded-lg transition-colors btn-ripple">
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Product Card 2 */}
                <div className="glass rounded-xl p-sm group relative overflow-hidden border border-outline-variant/30 hover:border-primary/50 transition-colors hover-lift">
                  <div className="aspect-[4/3] bg-surface-container rounded-lg mb-sm relative flex items-center justify-center p-sm overflow-hidden">
                    <button className="absolute top-3 right-3 text-error bg-surface/80 backdrop-blur p-1.5 rounded-full z-10 shadow hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                    <img alt="Headphones" className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYYI619vZpQTYrogEpp3bGFn45NdyxI_6ZjiBPWnz9dMU8VHCJHJL0TYi4pmMmk8VbYAII7fCM9FNbtKAUSVhSEQ3DQ2OfO2w-wHBucA6c--6vVH-QY9fq86HOxHtOAf0VKn15VP61eRzk-zuPBdMYg9UMPPKgZ4xp3b2U_UFJSVwhLs2Ptvpr2BvGJNkBwd-8rqC3KAzRv0t595NiZBN2DlJBQSW4Y7huu4FDav6fN20YVjTmtNPjybPcW2lqD9-3R-FrWHn30sjW" />
                  </div>
                  <div className="px-xs pb-xs">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Audio</span>
                    <h3 className="font-body-lg text-on-surface truncate font-semibold mb-2 group-hover:text-primary transition-colors">Sonic ANC Buds</h3>
                    <div className="flex items-center justify-between mt-xs">
                      <span className="font-headline-md font-bold text-primary">$249</span>
                      <button className="text-primary hover:bg-primary text-primary hover:text-on-primary border border-primary/30 p-2 rounded-lg transition-colors btn-ripple">
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Card 3 */}
                <div className="glass rounded-xl p-sm group relative overflow-hidden border border-outline-variant/30 hover:border-primary/50 transition-colors hover-lift">
                  <div className="aspect-[4/3] bg-surface-container rounded-lg mb-sm relative flex items-center justify-center p-sm overflow-hidden">
                    <button className="absolute top-3 right-3 text-error bg-surface/80 backdrop-blur p-1.5 rounded-full z-10 shadow hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                    <img alt="Tablet" className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrXmuz93Jr2VsMP7cqI8MjVmL924lXo0iZQUmbnyYFnR3WjS83hfNnNB63dHS6QqKXLkAuaSnajg7x2JgaB1DEis8H_FQR4oFNCIEGImJ4RK07I8ltTnVRkyz7KtBTDV1TgSbgz7yto_cb9cmWt0qT0hv3X8tw61AzLjqpk9QI3C5elKtqVrGeKoJTmE6sDuFIXB46_cDf0rUqkEa7LEr4hVIZ3Or_jf3CGydVdbZ4B5BW_hxdwV9V9BWWcH1vPoadB4486OeByWZI" />
                  </div>
                  <div className="px-xs pb-xs">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Tablet</span>
                    <h3 className="font-body-lg text-on-surface truncate font-semibold mb-2 group-hover:text-primary transition-colors">Slate Ultra 12"</h3>
                    <div className="flex items-center justify-between mt-xs">
                      <span className="font-headline-md font-bold text-primary">$799</span>
                      <button className="text-primary hover:bg-primary text-primary hover:text-on-primary border border-primary/30 p-2 rounded-lg transition-colors btn-ripple">
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
             <div className="fade-in-up">
               <div className="flex justify-between items-center mb-lg">
                 <h1 className="font-headline-lg text-on-surface text-glow">Address Book</h1>
                 <button className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 btn-ripple hover:glow-primary-hover glow-primary">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add New
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-md stagger-children">
                 <div className="rounded-2xl p-lg flex flex-col justify-between glass border border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">Default</div>
                    <div>
                      <h3 className="font-body-lg text-on-surface flex items-center gap-2 mb-md">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-full text-[18px]">home_pin</span> 
                        Sector 7G Residence
                      </h3>
                      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mb-4">
                        <p className="font-body-md text-on-surface font-medium mb-1">Alex Mercer</p>
                        <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                          Apt 4B, 128 Tech Boulevard<br/>
                          Cyber District, Neo City 90210
                        </p>
                        <p className="font-body-md text-on-surface-variant flex items-center gap-2 font-mono text-sm mt-3 pt-3 border-t border-outline-variant/20">
                          <span className="material-symbols-outlined text-[16px]">phone_iphone</span> +1 (555) 019-8234
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="flex-1 bg-surface-bright border border-outline-variant hover:border-primary text-on-surface font-label-md py-2 rounded-lg transition-colors btn-ripple">Edit</button>
                    </div>
                 </div>

                 <div className="rounded-2xl p-lg flex flex-col justify-between glass border border-outline-variant/30 hover:border-primary/30 transition-colors">
                    <div>
                      <h3 className="font-body-lg text-on-surface flex items-center gap-2 mb-md">
                        <span className="material-symbols-outlined text-on-surface-variant bg-surface-container-highest p-1.5 rounded-full text-[18px]">work</span> 
                        Corporate Office HQ
                      </h3>
                      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mb-4 opacity-70">
                        <p className="font-body-md text-on-surface font-medium mb-1">Alex Mercer (IT Dept)</p>
                        <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                          Floor 12, MegaCorp Building<br/>
                          Financial District, Neo City 90215
                        </p>
                        <p className="font-body-md text-on-surface-variant flex items-center gap-2 font-mono text-sm mt-3 pt-3 border-t border-outline-variant/20">
                          <span className="material-symbols-outlined text-[16px]">phone_iphone</span> +1 (555) 019-9999
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="flex-1 bg-surface-bright border border-outline-variant hover:border-primary text-on-surface font-label-md py-2 rounded-lg transition-colors btn-ripple">Edit</button>
                       <button className="px-4 bg-error/10 border border-error/20 text-error hover:bg-error hover:text-on-error font-label-md py-2 rounded-lg transition-colors btn-ripple"><span className="material-symbols-outlined text-[18px] block">delete</span></button>
                    </div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Account;
