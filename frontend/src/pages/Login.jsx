import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState(location.state?.mode === 'register' ? 'register' : 'signin'); // 'signin' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'admin@techpro.eng',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ ...formData, mode });
      navigate('/account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden page-enter bg-surface">
      {/* Left Side: Interactive Forms (Scrollable) */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto custom-scrollbar flex flex-col justify-start pt-xl pb-xl lg:py-[10vh] px-margin-mobile md:px-margin-desktop lg:px-[10vw] relative z-10 fade-in-up">
        <div className="w-full max-w-md mx-auto mt-xl lg:mt-0 stagger-children">
          {/* Brand Logo */}
          <div className="flex items-center gap-sm group mb-lg">
            <span className="material-symbols-outlined text-primary text-[32px] group-hover:rotate-180 transition-transform duration-700">architecture</span>
            <Link to="/" className="font-headline-md text-headline-md font-bold tracking-tight text-primary">TechPro</Link>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-md mb-xl border-b border-outline-variant/30 pb-sm">
            <button
              className={`font-label-md text-label-md pb-sm px-xs -mb-[13px] transition-all duration-300 relative ${mode === 'signin' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setMode('signin')}
            >
              Sign In
              {mode === 'signin' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(185,199,228,0.8)]"></div>}
            </button>
            <button
              className={`font-label-md text-label-md pb-sm px-xs -mb-[13px] transition-all duration-300 relative ${mode === 'register' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setMode('register')}
            >
              Create Account
              {mode === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(185,199,228,0.8)]"></div>}
            </button>
          </div>

          {/* Header */}
          <div className="mb-lg h-[80px]">
            <h1 key={`title-${mode}`} className="font-headline-lg text-headline-lg text-on-surface mb-xs fade-in">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p key={`desc-${mode}`} className="font-body-md text-body-md text-on-surface-variant fade-in" style={{animationDelay: '0.1s'}}>
              {mode === 'signin'
                ? 'Enter your credentials to access your terminal.'
                : 'Initialize your TechPro identity protocol.'}
            </p>
          </div>

          {/* Quick Auth Buttons */}
          <div className="flex flex-col gap-sm mb-lg">
            <button className="flex items-center justify-center gap-sm w-full py-sm px-md border border-outline-variant rounded-lg hover:bg-surface-variant hover:border-primary/50 transition-all group btn-ripple">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="group-hover:scale-110 transition-transform">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Continue with Google</span>
            </button>
            <button className="flex items-center justify-center gap-sm w-full py-sm px-md border border-outline-variant rounded-lg hover:bg-surface-variant hover:border-primary/50 transition-all group btn-ripple">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-on-surface-variant group-hover:text-primary group-hover:scale-110 transition-all">
                <path d="M16.365 14.86c-1.332-1.996-1.554-4.814.98-6.15-1.124-1.503-3.08-1.785-3.805-1.815-1.614-.153-3.167.925-3.99.925-.823 0-2.12-.907-3.46-.88-1.727.025-3.327.972-4.22 2.47-1.808 3.04-.46 7.545 1.295 9.99 1.155 1.62 2.128 3.03 3.655 3.12 1.484.09 2.062-.843 3.79-.843 1.726 0 2.253.843 3.81.817 1.608-.027 2.443-1.285 3.31-2.52 1.006-1.42 1.42-2.793 1.442-2.865-.03-.01-2.658-.988-2.807-4.148zm-1.854-8.15c.806-.94 1.348-2.247 1.2-3.56-1.16.046-2.548.748-3.383 1.71-.664.764-1.304 2.1-1.127 3.39 1.28.096 2.505-.6 3.31-1.54z"/>
              </svg>
              <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Continue with Apple ID</span>
            </button>
          </div>

          <div className="flex items-center gap-sm mb-lg opacity-60">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant px-sm uppercase tracking-wider">or command line</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            <div className={`flex flex-col gap-md transition-all duration-500 overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0 m-0'}`}>
              <div className="flex flex-col gap-xs relative">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="fullname">Full Name</label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-sm text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors">person</span>
                  <input
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-sm pl-xl pr-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50 hover:border-primary/50"
                    id="fullname"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Alex Mercer"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-xs relative">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Access Identifier (Email)</label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-sm text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                  <input
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-sm pl-xl pr-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50 tracking-wide hover:border-primary/50"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@techpro.eng"
                    required
                    type="email"
                  />
              </div>
            </div>

            <div className="flex flex-col gap-xs relative">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Security Key (Password)</label>
                <div className={`transition-all duration-300 ${mode === 'signin' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <Link className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors underline" to="/contact">Forgot Key?</Link>
                </div>
              </div>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-sm text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                <input
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-sm pl-xl pr-xl font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all tracking-widest hover:border-primary/50"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-sm text-on-surface-variant hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${mode === 'signin' ? 'max-h-10 opacity-100 mt-xs' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="flex items-center gap-sm">
                <div className="relative flex items-center cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant bg-surface-container appearance-none checked:bg-primary checked:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface transition-colors cursor-pointer" id="remember" type="checkbox" />
                  <span className="material-symbols-outlined absolute text-[14px] text-on-primary pointer-events-none opacity-0 group-has-[:checked]:opacity-100 transition-opacity" style={{left: '1px'}}>check</span>
                </div>
                <label className="font-label-sm text-label-sm text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" htmlFor="remember">Keep session active</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-md w-full py-3 px-lg bg-primary text-on-primary font-label-md text-label-md rounded-lg glow-primary glow-primary-hover transition-all flex justify-center items-center gap-sm btn-ripple group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-[150%] group-hover:animate-[ticker_1s_ease-in-out]"></div>
              <span className="z-10">{isSubmitting ? 'Synchronizing...' : mode === 'signin' ? 'Initialize Link' : 'Create Identity'}</span>
              <span className="material-symbols-outlined text-[18px] z-10 group-hover:translate-x-1 transition-transform">{isSubmitting ? 'sync' : 'arrow_forward'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-lg flex items-start gap-sm p-md rounded-lg border border-primary/20 bg-primary/5 hover-lift transition-all">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>shield_locked</span>
            <div>
              <h4 className="font-label-sm text-label-sm text-primary mb-xs">Level 2 Security Active</h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Upon successful credential validation, a multi-factor authentication token will be requested.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Minimal */}
        <div className="mt-xl w-full flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity pb-lg">
          <p className="font-label-sm text-label-sm text-on-surface-variant">&copy; {new Date().getFullYear()} TechPro Engineering.</p>
          <div className="flex gap-md">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline" to="/policies">Protocol</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors underline" to="/contact">Support</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Art (Fixed) */}
      <div className="hidden lg:block w-1/2 h-full relative overflow-hidden bg-surface-container-lowest border-l border-outline-variant/20 fade-in-right">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110 ease-linear"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtFhpF4GoQmle2w9L-li1IdML_SAgzoz4TGzKUPydLyxID7gSTTLOTBtFh8-5jew1GJbQYFYhd5_p14N8wWD1mcbEEqSjHMM5Gh2sy5Ubr4378ZOATdne1rtkG-ku0ZdcbhgyoFyKyJr7ljNdZLS0WE9JPEnymmH0tA9mLlhYysHRKjE9pnBbrEWrXwB_34UjRaPIf8QRDq0vZCxOGjjxGibT7bUY9wbKKcvuWHuYzdzdy3vDxpg0RtpERF_QhbM-Mq2D8HLz19smx')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-surface/20"></div>
          {/* Tech overlay grid */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#B9C7E4_1px,transparent_1px),linear-gradient(to_bottom,#B9C7E4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Glassmorphic Tech Spec Floating Card */}
        <div className="absolute bottom-lg right-xl p-md rounded-xl border border-primary/30 glass shadow-[0_0_30px_rgba(185,199,228,0.1)] w-72 fade-in-right" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-sm mb-sm border-b border-outline-variant/30 pb-sm">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest text-[12px]">System Status</h3>
          </div>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between items-center font-label-sm text-label-sm p-3 rounded-lg border border-transparent hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer group hover:shadow-[0_0_20px_rgba(185,199,228,0.15)] hover:-translate-y-0.5">
              <span className="text-on-surface-variant flex items-center gap-2 group-hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">thermostat</span> Core Temp</span>
              <span className="text-primary font-mono text-glow group-hover:brightness-125 transition-all">14.2°C</span>
            </li>
            <li className="flex justify-between items-center font-label-sm text-label-sm p-3 rounded-lg border border-transparent hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer group hover:shadow-[0_0_20px_rgba(185,199,228,0.15)] hover:-translate-y-0.5">
              <span className="text-on-surface-variant flex items-center gap-2 group-hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">speed</span> Uplink Speed</span>
              <span className="text-primary font-mono text-glow group-hover:brightness-125 transition-all">10.4 Tbps</span>
            </li>
            <li className="flex justify-between items-center font-label-sm text-label-sm p-3 rounded-lg border border-transparent hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all cursor-pointer group hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:-translate-y-0.5">
              <span className="text-on-surface-variant flex items-center gap-2 group-hover:text-[#00E5FF] transition-colors"><span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">security</span> Node Integrity</span>
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] group-hover:shadow-[0_0_12px_rgba(0,229,255,1)] animate-pulse transition-all"></span>
                <span className="text-on-surface font-mono group-hover:text-[#00E5FF] transition-colors">100%</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
