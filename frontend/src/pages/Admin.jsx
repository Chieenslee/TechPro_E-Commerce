import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="flex w-full min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline-variant/30 flex flex-col hidden lg:flex">
        <div className="p-lg border-b border-outline-variant/30 flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[28px]">shield_person</span>
          <span className="font-headline-sm font-bold text-primary tracking-widest">ADMIN.OS</span>
        </div>
        <nav className="flex-1 py-md flex flex-col gap-xs px-sm">
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-[inset_2px_0_0_0_#B9C7E4]" to="/admin">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors" to="/admin">
            <span className="material-symbols-outlined">inventory_2</span> Products
          </Link>
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors" to="/admin">
            <span className="material-symbols-outlined">shopping_cart</span> Orders
          </Link>
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors" to="/admin">
            <span className="material-symbols-outlined">group</span> Users
          </Link>
        </nav>
        <div className="p-md border-t border-outline-variant/30">
          <Link className="flex items-center gap-sm px-md py-sm rounded-lg text-error hover:bg-error/10 transition-colors" to="/">
            <span className="material-symbols-outlined">logout</span> Exit System
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto page-enter custom-scrollbar">
        <header className="h-20 bg-surface/80 backdrop-blur border-b border-outline-variant/30 flex items-center justify-between px-lg sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <h1 className="font-headline-md font-bold">System Dashboard</h1>
          </div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
            <div className="flex items-center gap-sm pl-md border-l border-outline-variant/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold font-label-md">A</div>
              <span className="font-label-md hidden sm:block">Admin.Root</span>
            </div>
          </div>
        </header>

        <div className="p-lg lg:p-xl flex flex-col gap-xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md stagger-children">
            <div className="glass p-md rounded-xl border border-primary/20 flex flex-col gap-sm relative overflow-hidden hover-lift">
              <div className="absolute -right-4 -top-4 text-primary/10">
                <span className="material-symbols-outlined text-[100px]">attach_money</span>
              </div>
              <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">Total Revenue</span>
              <span className="font-headline-lg font-bold text-primary text-glow relative z-10">$124,500</span>
              <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">trending_up</span> +12% this week</span>
            </div>
            <div className="glass p-md rounded-xl border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden hover-lift">
              <div className="absolute -right-4 -top-4 text-white/5">
                <span className="material-symbols-outlined text-[100px]">shopping_cart</span>
              </div>
              <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">Active Orders</span>
              <span className="font-headline-lg font-bold text-on-surface relative z-10">342</span>
              <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">trending_up</span> +5% this week</span>
            </div>
            <div className="glass p-md rounded-xl border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden hover-lift">
              <div className="absolute -right-4 -top-4 text-white/5">
                <span className="material-symbols-outlined text-[100px]">group</span>
              </div>
              <span className="font-label-md text-on-surface-variant uppercase tracking-wider relative z-10">New Users</span>
              <span className="font-headline-lg font-bold text-on-surface relative z-10">1,204</span>
              <span className="font-label-sm text-[#00E5FF] flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">trending_up</span> +18% this week</span>
            </div>
            <div className="glass p-md rounded-xl border border-error/30 flex flex-col gap-sm relative overflow-hidden hover-lift bg-error/5">
              <div className="absolute -right-4 -top-4 text-error/10">
                <span className="material-symbols-outlined text-[100px]">warning</span>
              </div>
              <span className="font-label-md text-error uppercase tracking-wider relative z-10">System Alerts</span>
              <span className="font-headline-lg font-bold text-error text-glow relative z-10">2</span>
              <span className="font-label-sm text-error/80 flex items-center gap-1 relative z-10">Requires immediate attention</span>
            </div>
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 glass rounded-xl border border-outline-variant/30 p-lg fade-in-up">
              <h2 className="font-headline-sm mb-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">monitoring</span>
                Network Traffic
              </h2>
              <div className="h-64 w-full bg-surface-container rounded-lg border border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                <span className="font-label-md text-on-surface-variant tracking-widest relative z-10">CHART VISUALIZATION.MODULE</span>
              </div>
            </div>
            
            <div className="glass rounded-xl border border-outline-variant/30 p-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-headline-sm mb-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00E5FF]">sync</span>
                Recent Operations
              </h2>
              <div className="flex flex-col gap-md">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-outline-variant/20 last:border-0 last:pb-0">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[16px]">check_circle</span>
                    <div>
                      <p className="font-label-sm text-on-surface">Order #{9000 + i} processed</p>
                      <p className="font-label-sm text-on-surface-variant text-[10px] mt-0.5">{i * 2} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
