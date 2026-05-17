
const SystemLoading = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden min-h-screen bg-background text-on-background z-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(185, 199, 228, 0.15) 0%, transparent 60%)" }}></div>

      {/* Simulated Code Background */}
      <div aria-hidden="true" className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none flex flex-col overflow-hidden font-mono text-xs text-primary leading-relaxed p-4 animate-[pulse_4s_ease-in-out_infinite]">
        <div className="whitespace-pre">
{`[SYS] Initializing core modules...
[SYS] Loading memory banks... OK
[NET] Establishing secure connection to TechPro servers...
[NET] Handshake successful. Key exchange complete.
[DB] Synchronizing local cache... 23%
[AUTH] Verifying user credentials token...
[UI] Pre-rendering interface components...
[SEC] Applying cryptographic overlays...
[SYS] Allocating resources: CPU 12%, RAM 450MB
[DB] Synchronizing local cache... 68%
[NET] Fetching latest hardware specifications...
[NET] Fetching latest software patches...
[SYS] Running diagnostic checks... ALL SYSTEMS NOMINAL
[DB] Synchronizing local cache... 100%
[SYS] Boot sequence nearing completion...`}
        </div>
        <div className="whitespace-pre mt-auto">
{`> Executing start.sh
> Loading TechPro UI Engine v2.4.1
> Awaiting final data payload...`}
        </div>
      </div>

      {/* Main Loading Container */}
      <div className="z-10 w-full max-w-md px-margin-mobile md:px-0 flex flex-col items-center fade-in-up">
        {/* TechPro Logo */}
        <div className="mb-xl flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 animate-[spin_3s_linear_infinite]"></div>
             <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_2s_linear_infinite_reverse]"></div>
             <span className="material-symbols-outlined text-primary text-[40px] relative z-10 animate-pulse">memory</span>
          </div>
          <h1 className="font-headline-xl text-primary font-bold tracking-tight text-glow">TechPro</h1>
          <p className="font-label-sm text-primary/70 mt-2 uppercase tracking-widest text-[11px] font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Precision Built
          </p>
        </div>

        {/* Loading Interface (Glassmorphism Card) */}
        <div className="glass border border-primary/30 rounded-3xl p-lg w-full shadow-[0_0_50px_rgba(185,199,228,0.1)] flex flex-col items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Status Text */}
            <h2 className="font-headline-md text-on-surface mb-2 text-center text-glow">Đang khởi tạo kết nối hệ thống...</h2>
            <p className="font-body-md text-on-surface-variant mb-lg text-center leading-relaxed">Vui lòng chờ trong khi chúng tôi đồng bộ hóa dữ liệu phần cứng và thiết lập không gian làm việc của bạn.</p>

            {/* Hi-Tech Progress Bar */}
            <div className="w-full relative h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4 border border-outline-variant/30">
              {/* Animated progress bar representation */}
              <div className="absolute top-0 left-0 h-full bg-primary w-2/3 shadow-[0_0_15px_rgba(185,199,228,0.8)] relative">
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50 animate-[translateX_2s_linear_infinite]"></div>
              </div>
            </div>

            {/* Loading Details */}
            <div className="w-full flex justify-between items-center font-mono text-[10px] text-outline-variant uppercase tracking-widest border-t border-outline-variant/20 pt-4">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-primary animate-spin">sync</span>
                [NET] Đồng bộ dữ liệu...
              </span>
              <span className="text-primary font-bold">66%</span>
            </div>
            
            {/* Pulse Indicator */}
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-on-surface-variant uppercase tracking-widest border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(185,199,228,0.8)] animate-ping"></div>
              <span>Hệ thống đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SystemLoading;
