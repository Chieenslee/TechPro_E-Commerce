
import { useState } from 'react';
import { Link } from 'react-router-dom';
import newsApi from '../api/newsApi';

const trendingReviews = [
  {
    id: 1,
    title: "Zenith Pro Laptop (2024): The Developer's Dream",
    rating: '9.5/10',
    productId: 11
  },
  {
    id: 2,
    title: 'Aura Sync Wireless Earbuds: Noise Cancellation Perfected',
    rating: '8.8/10',
    productId: 31
  },
  {
    id: 3,
    title: 'Titan Forge RTX Desktop: Uncompromised Rendering',
    rating: '9.0/10',
    productId: 21
  },
  {
    id: 4,
    title: 'Lumina Smart Home Hub: Tying It All Together',
    rating: '8.2/10',
    productId: 51
  }
];

const News = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!email) {
      setNewsletterStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    setIsSubscribing(true);
    setNewsletterStatus(null);
    try {
      await newsApi.subscribe(email);
      setNewsletterStatus({
        type: 'success',
        message: 'Subscription active. Daily brief is now linked to your inbox.'
      });
      setNewsletterEmail('');
    } catch (error) {
      console.error('Newsletter subscribe failed', error);
      const message = error.response?.data?.message || 'Subscription failed. Please verify the email and try again.';
      setNewsletterStatus({
        type: 'error',
        message
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile lg:px-margin-desktop py-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter page-enter">
      {/* Left Column: Main Content (Hero + Grid) */}
      <div className="lg:col-span-8 flex flex-col gap-lg">
        {/* Featured News Hero */}
        <section className="group cursor-pointer flex flex-col gap-sm fade-in-up hover-lift transition-transform">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass border border-outline-variant/30 group-hover:border-primary/50 transition-colors shadow-[0_0_20px_rgba(185,199,228,0.05)]">
            <img alt="AI Chip Architecture" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZMYQgoWrwBwms23QVp2BsifVI_S6SE8panht-1qrqQrYEVMx5ZjJChyuivd-Q8c9r3_ZhOD-yUe9hWm9P8DjqhvRwg_3sLh2DuOZxkbe9KfLFXcg8RDbDto2e5WyLfbBOEUU8gcbYtwYT3RG65ye8eGTQGQn0qoOcISvOfVLJ5XJtzw7KHlCbdU0fBimF6Wns3K1dTuCzt3N7c0dY1Kmg1hIu3A_WpWG7b_QIB1aL8983wpGIDoSWuXps5V-wwOpdKX3Vqc69cS6f" />
            <div className="absolute top-md left-md bg-primary text-on-primary px-4 py-1.5 rounded text-label-sm font-bold uppercase tracking-widest shadow-[0_4px_10px_rgba(0,229,255,0.3)] animate-pulse">
              Breaking
            </div>
            {/* Tech Overlay on hover */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-3 text-label-sm text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
              <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">Hardware</span>
              <span className="opacity-50">•</span>
              <span>4 hours ago</span>
              <span className="opacity-50">•</span>
              <span>By Alex Vance</span>
            </div>
            <h1 className="font-headline-xl text-on-surface group-hover:text-primary transition-colors text-glow">Next-Gen Quantum Processors Break the 1000-Qubit Barrier</h1>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">The latest breakthrough from leading research labs promises to accelerate material science and cryptography by orders of magnitude, moving quantum computing from theoretical to practical.</p>
          </div>
        </section>

        {/* News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-xl pt-lg border-t border-outline-variant/30 fade-in-up stagger-children" style={{ animationDelay: '0.2s' }}>
          {/* Article Card */}
          <article className="flex flex-col gap-md group cursor-pointer hover-lift">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden glass border border-outline-variant/30 group-hover:border-tertiary/50 transition-colors">
              <img alt="AR Headset" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2DgsNRFDC9chn1vnTxxA7TZ-jxUqWjbH7CBpWXJtsWlSNbVfC_EwwyH-__yPlzhXmYnjdpr0G320y1G8q7gutK_fK6-kgfsTKvwaA_P53mnFWQ30wxYjLEScA-OZgE0GkdZqdMYXU2shhj9ruroWDfRluVtcz9XCX0ohFMHgGgtnuVVccgL90WyBWnOYsYLfb2bciuQBQ8AxwKvQTOKdm72nEjB1z-mlNzfI6edL3AEajg2tpLSL74Dm_M1AHfCcwdVIliKWW46E7" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-sm text-on-surface-variant flex gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20">AR/VR</span> 
                <span className="opacity-50">•</span> 
                <span>Yesterday</span>
              </div>
              <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">New Ultra-Light AR Glasses Enter Production</h3>
              <p className="font-body-md text-on-surface-variant line-clamp-2">A look at the upcoming mixed reality wearables that aim to replace smartphones with everyday augmented overlays.</p>
            </div>
          </article>

          {/* Article Card */}
          <article className="flex flex-col gap-md group cursor-pointer hover-lift">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden glass border border-outline-variant/30 group-hover:border-error/50 transition-colors">
              <img alt="Cybersecurity" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrN2x14cseuFlvXgYNPLGbIyV1CH57cdU9NKeaQdpepMzKRzSEm_75cK_8Wm6b-FN8ebiDUvcp81X6NANVwj_4IJ1FiRpW9DJgSSCEvrWTFgjSZ8fal_wz6Ld5aDUb6NBxfv4bSNqji47HB4uE1oJmHnsDWkZJ4lt6d4B-c_Yvz_qb1-JGYIpG6eAx1hyoj1VAKiEObJmEkYljzu3etA-5yrRdpbTMvK8lv6Rz7bCtYAkKOf3bh3-mGnqRNxV-ZLQ_mEsAWjVKARNk" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-sm text-on-surface-variant flex gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-error bg-error/10 px-2 py-0.5 rounded border border-error/20">Security</span> 
                <span className="opacity-50">•</span> 
                <span>2 days ago</span>
              </div>
              <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">Critical Zero-Day Patched in Major Cloud Services</h3>
              <p className="font-body-md text-on-surface-variant line-clamp-2">Administrators are urged to update immediately as details emerge about a widespread vulnerability affecting serverless architectures.</p>
            </div>
          </article>

          {/* Article Card */}
          <article className="flex flex-col gap-md group cursor-pointer hover-lift">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden glass border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
              <img alt="Mobile UI" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkQ3NIaFR_LNLNl15SAgsjmIb7Gcu4iBL1XMz13Xhb-EwFj0nMRL-6dVJKK0MUDhlzD4vQhqzp7dybWPodDpklL-g-3qSmu4-3U0XZPRYRHa1L3CnEnAMm_EDtoTW4So_0O5hEnvijd7O_adD1kd1hwfTKv5TogSKTKeGNlntazosZK_ZUDb5r1C0UMCBzVthour-QpZzDCDq-3TOfcu6-3VW9334aq7Us-LA3BL9Qofy6WoVhTlwrbLr9iPAXr9yuw81XqUIfuuUM" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-sm text-on-surface-variant flex gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Software</span> 
                <span className="opacity-50">•</span> 
                <span>3 days ago</span>
              </div>
              <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">Mobile OS 18 Brings Radical Redesign to Notifications</h3>
              <p className="font-body-md text-on-surface-variant line-clamp-2">The upcoming update focuses on AI-driven context filtering, reducing cognitive load for heavy smartphone users.</p>
            </div>
          </article>

          {/* Article Card */}
          <article className="flex flex-col gap-md group cursor-pointer hover-lift">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden glass border border-outline-variant/30 group-hover:border-secondary/50 transition-colors">
              <img alt="Robotics" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB4dFC3KtRCKxmHEW0a-oZjNLakuyxT3GR3iqbpzeezYU6yak57iFc-qUGcCPFH0inVx-1W5urJjN5HDtrlZy2n_9tXb4J4jm4--AK7qPb2n0hPUIiNqKOVxjEJqBpjdkCkhxieBOtJ8y2z5xa-PB2F05LdpZuLOTXosedAgmR2Y4slBtCETtjbgAclopmKFOqVXDtl1VDOQW9VVYWgyAEy02t_IC8s4QUMkKm0tZt_oU-NyjvC9VQT3ifKVTlV-PBCzjjQXKngOdN" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-sm text-on-surface-variant flex gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">Robotics</span> 
                <span className="opacity-50">•</span> 
                <span>Oct 24</span>
              </div>
              <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">Bipedal Robots Navigate Complex Terrain Autonomously</h3>
              <p className="font-body-md text-on-surface-variant line-clamp-2">New reinforcement learning models allow industrial robots to traverse disaster zones without human intervention.</p>
            </div>
          </article>
        </section>
      </div>

      {/* Right Column: Sidebar (Trending + Newsletter) */}
      <aside className="lg:col-span-4 flex flex-col gap-xl fade-in-up" style={{ animationDelay: '0.4s' }}>
        {/* Newsletter Signup */}
        <div className="glass p-lg rounded-2xl border border-outline-variant/30 flex flex-col gap-md relative overflow-hidden group hover:border-primary/50 transition-colors hover-lift">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>
          <div className="flex items-center gap-3 text-primary relative z-10">
            <span className="material-symbols-outlined text-[32px] bg-primary/10 p-2 rounded-lg border border-primary/20">mail</span>
            <h3 className="font-headline-md">TechPro Daily</h3>
          </div>
          <p className="font-body-md text-on-surface-variant relative z-10 leading-relaxed">Get the definitive daily brief on technology, directly to your inbox. No fluff, just precision.</p>
          <form className="flex flex-col gap-3 relative z-10 mt-2" onSubmit={handleNewsletterSubmit}>
            <div className="relative group/input">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within/input:text-primary transition-colors">alternate_email</span>
              <input
                className="w-full bg-surface-container border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-primary/50"
                placeholder="Enter your email"
                required
                type="email"
                value={newsletterEmail}
                disabled={isSubscribing}
                onChange={(event) => setNewsletterEmail(event.target.value)}
              />
            </div>
            <button disabled={isSubscribing} className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md font-bold transition-colors btn-ripple glow-primary hover:glow-primary-hover disabled:opacity-60" type="submit">
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
            {newsletterStatus && (
              <p className={`font-label-sm rounded-lg px-3 py-2 ${
                newsletterStatus.type === 'success'
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-error bg-error/10 border border-error/20'
              }`}>
                {newsletterStatus.message}
              </p>
            )}
          </form>
        </div>

        {/* Popular Reviews List */}
        <div className="flex flex-col gap-md glass p-lg rounded-2xl border border-outline-variant/30">
          <h2 className="font-headline-md text-on-surface border-b border-outline-variant/30 pb-sm mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span> Trending Reviews
          </h2>
          <div className="flex flex-col gap-4 stagger-children">
            {trendingReviews.map((review, index) => (
              <div key={review.id} className="flex flex-col gap-4">
                <Link className="flex gap-4 group p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer" to={`/products/${review.productId}`}>
                  <div className="font-headline-lg font-bold text-outline-variant group-hover:text-primary transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-body-lg font-medium text-on-surface group-hover:text-primary transition-colors">{review.title}</h4>
                    <span className="font-mono text-[11px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded w-fit">Rating: {review.rating}</span>
                  </div>
                </Link>
                {index < trendingReviews.length - 1 && <div className="h-px bg-outline-variant/20 w-full"></div>}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
};

export default News;
