import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContextValue';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  // Flash Sale Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timer);
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Product Tabs
  const [activeTab, setActiveTab] = useState('Best Sellers');
  const tabs = ['Best Sellers', 'New Arrivals', 'Top Rated'];

  // Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeWhMxn8u7HEVMiCUE0LE1g4qPUlNyzc7Ku--5DC3vmnC2oW59l0U6ryvnm7TAM-JBdWCz2R7FjpoPWtAm4uRpPB7a7MMHBfqPccVFa0aevFIL4N2LREt9Djld2g2_nnueLm48UXlSLCtIVoTMUpmeYKRSTHr4etodP4uTdHdfcLSMubHoRv9Hf-CPA3JxyGSzmP3tN-XaPHc6g57t5aALk_WNPsuk_hZeLbWxul6xLeWjCY7A105fZDn-Y6eJcLjXHp7SMrHNn_e7",
      title: "Precision in Every Pulse",
      desc: "Experience the next generation of electronic accuracy and futuristic design. The all-new Quantum X Pro is here.",
      tag: "New Arrival"
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsa5ZHbjDj6D7qUvcVxGCYNiOyjb-Q8zUTTtKu8gI0Kg-UcJztDCo7PWpbMIvzhxi5-x0JtR4ali2KwMskPeO-9_MRj-8Imsdwlr5rcrOhwx-P7hEQuVXwL5wh6mWjHnz10f-S4PO3ooQmLHszcn-aXyRDN2XnAOXg9BrjQhUxkBskEb-gw0kZlWbP8wCeJrkpeBMPGM1kqlqoRQU2EkK3zDv1I7BjloJbfkc6r0bkvnFlJ5ScVx5jgAfP16n76FQVblnOtEPVEUI6",
      title: "Unleash Ultimate Power",
      desc: "Dominate your workflow with the new Nexus Series. Uncompromised performance meets sleek design.",
      tag: "Best Seller"
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYYI619vZpQTYrogEpp3bGFn45NdyxI_6ZjiBPWnz9dMU8VHCJHJL0TYi4pmMmk8VbYAII7fCM9FNbtKAUSVhSEQ3DQ2OfO2w-wHBucA6c--6vVH-QY9fq86HOxHtOAf0VKn15VP61eRzk-zuPBdMYg9UMPPKgZ4xp3b2U_UFJSVwhLs2Ptvpr2BvGJNkBwd-8rqC3KAzRv0t595NiZBN2DlJBQSW4Y7huu4FDav6fN20YVjTmtNPjybPcW2lqD9-3R-FrWHn30sjW",
      title: "Immersive Soundscape",
      desc: "Dive into pure audio bliss with the Sonic ANC Buds. Crystal clear sound, anywhere you go.",
      tag: "Top Rated"
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  return (
    <main className="page-enter">
      {/* Hero Section */}
      <section className="relative bg-surface-container h-[500px] overflow-hidden flex items-center group">
        <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent z-10"></div>
        
        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              alt={slide.title} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transform scale-105 transition-transform duration-[10000ms] ease-out" 
              style={{ transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.05)' }}
              src={slide.image} 
            />
          </div>
        ))}

        <div className="relative z-20 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="max-w-xl fade-in-up" key={`slide-content-${currentSlide}`}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary font-label-sm mb-4 border border-primary/30 shadow-[0_0_15px_rgba(185,199,228,0.2)]">
              {heroSlides[currentSlide].tag}
            </span>
            <h1 className="font-headline-xl text-on-surface mb-4 text-glow">{heroSlides[currentSlide].title}</h1>
            <p className="font-body-lg text-on-surface-variant mb-8">{heroSlides[currentSlide].desc}</p>
            <Link to="/products" className="inline-block bg-primary text-on-primary px-8 py-3 rounded-md font-label-md hover:bg-primary-fixed transition-colors btn-ripple glow-primary hover:glow-primary-hover hover-lift">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-primary glow-primary' : 'w-2 bg-outline-variant hover:bg-outline'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* USPs Bar */}
      <section className="bg-surface-container border-y border-outline-variant py-4 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
         <div className="absolute inset-0 shimmer opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 stagger-children">
          <div className="flex items-center space-x-sm text-on-surface-variant hover:text-primary transition-colors cursor-default">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            <span className="font-label-md">Free Shipping Worldwide</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-outline-variant"></div>
          <div className="flex items-center space-x-sm text-on-surface-variant hover:text-primary transition-colors cursor-default">
            <span className="material-symbols-outlined text-[24px]">verified</span>
            <span className="font-label-md">2-Year Precision Warranty</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-outline-variant"></div>
          <div className="flex items-center space-x-sm text-on-surface-variant hover:text-primary transition-colors cursor-default">
            <span className="material-symbols-outlined text-[24px]">sync</span>
            <span className="font-label-md">Easy 30-Day Returns</span>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-md gap-4">
          <div className="flex items-center gap-4 fade-in-up">
            <h2 className="font-headline-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[32px] animate-pulse">bolt</span> Flash Sale
            </h2>
            <div className="flex space-x-2 font-label-md text-on-surface bg-surface-container py-1.5 px-4 rounded-md border border-outline-variant shadow-[0_0_10px_rgba(255,180,171,0.1)]">
              <span className="text-error font-bold w-5 text-center">{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-on-surface-variant">h</span> <span className="text-outline-variant">:</span> 
              <span className="text-error font-bold w-5 text-center">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-on-surface-variant">m</span> <span className="text-outline-variant">:</span> 
              <span className="text-error font-bold w-5 text-center">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-on-surface-variant">s</span>
            </div>
          </div>
          <Link className="text-primary font-label-md hover:underline flex items-center group fade-in-up" to="/products">
            View All <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-children">
          {/* Product Card 1 */}
          <Link to="/products/1" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift relative overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 bg-error text-on-error px-2 py-1 rounded text-[10px] font-bold z-20 shadow-[0_0_10px_rgba(255,180,171,0.3)]">-30%</span>
              <img alt="Smartwatch" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800" />
            </div>
            <h3 className="font-label-md text-on-surface line-clamp-1 mb-1 group-hover:text-primary transition-colors">iPhone 15 Pro Max 256GB</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-headline-md text-primary">29.990.000 ₫</span>
              <span className="font-label-sm text-outline line-through">34.990.000 ₫</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                <span>Sold: 85%</span>
                <span>Available: 15</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[85%] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[ticker_2s_linear_infinite]"></div>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary text-primary border border-primary/30 rounded-md font-label-md transition-all duration-300 flex justify-center items-center gap-2 btn-ripple relative z-20" onClick={(e) => { e.preventDefault(); addToCart({id: 1, name: 'iPhone 15 Pro Max 256GB', price: 29990000, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800'}, 1); }}>
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Add to Cart
            </button>
          </Link>

          {/* Product Card 2 */}
          <Link to="/products/2" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift relative overflow-hidden block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 bg-error text-on-error px-2 py-1 rounded text-[10px] font-bold z-20 shadow-[0_0_10px_rgba(255,180,171,0.3)]">-15%</span>
              <img alt="Earbuds" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800" />
            </div>
            <h3 className="font-label-md text-on-surface line-clamp-1 mb-1 group-hover:text-primary transition-colors">Tai nghe AirPods Pro 2</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-headline-md text-primary">6.190.000 ₫</span>
              <span className="font-label-sm text-outline line-through">6.990.000 ₫</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                <span>Sold: 40%</span>
                <span>Available: 120</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%]"></div>
              </div>
            </div>
            <button className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary text-primary border border-primary/30 rounded-md font-label-md transition-all duration-300 flex justify-center items-center gap-2 btn-ripple relative z-20" onClick={(e) => { e.preventDefault(); addToCart({id: 6, name: 'Tai nghe AirPods Pro 2', price: 6190000, image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800'}, 1); }}>
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Add to Cart
            </button>
          </Link>

          {/* Product Card 3 */}
          <Link to="/products/3" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift relative overflow-hidden hidden sm:block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 bg-error text-on-error px-2 py-1 rounded text-[10px] font-bold z-20 shadow-[0_0_10px_rgba(255,180,171,0.3)]">-20%</span>
              <img alt="Headphones" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800" />
            </div>
            <h3 className="font-label-md text-on-surface line-clamp-1 mb-1 group-hover:text-primary transition-colors">MacBook Pro 14 M3 Pro</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-headline-md text-primary">49.990.000 ₫</span>
              <span className="font-label-sm text-outline line-through">55.990.000 ₫</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                <span className="text-error font-bold">Sold: 95%</span>
                <span>Available: 3</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full w-[95%]"></div>
              </div>
            </div>
            <button className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary text-primary border border-primary/30 rounded-md font-label-md transition-all duration-300 flex justify-center items-center gap-2 btn-ripple relative z-20" onClick={(e) => { e.preventDefault(); addToCart({id: 3, name: 'MacBook Pro 14 M3 Pro', price: 49990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'}, 1); }}>
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Add to Cart
            </button>
          </Link>

          {/* Product Card 4 */}
          <Link to="/products/4" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift relative overflow-hidden hidden lg:block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 bg-error text-on-error px-2 py-1 rounded text-[10px] font-bold z-20 shadow-[0_0_10px_rgba(255,180,171,0.3)]">-50%</span>
              <img alt="Speaker" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800" />
            </div>
            <h3 className="font-label-md text-on-surface line-clamp-1 mb-1 group-hover:text-primary transition-colors">Loa Harman Kardon Onyx 8</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-headline-md text-primary">6.990.000 ₫</span>
              <span className="font-label-sm text-outline line-through">7.990.000 ₫</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                <span>Sold: 60%</span>
                <span>Available: 45</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[60%]"></div>
              </div>
            </div>
            <button className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary text-primary border border-primary/30 rounded-md font-label-md transition-all duration-300 flex justify-center items-center gap-2 btn-ripple relative z-20" onClick={(e) => { e.preventDefault(); addToCart({id: 7, name: 'Loa Harman Kardon Onyx 8', price: 6990000, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'}, 1); }}>
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Add to Cart
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-surface-container-low py-lg px-margin-mobile md:px-margin-desktop border-y border-outline-variant relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGgxdjEwSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+CjxwYXRoIGQ9Ik0wIDEwaDEwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-headline-lg text-on-surface mb-md text-center fade-in-up">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=phones">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">smartphone</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Phones</span>
            </Link>
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=laptops">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">laptop_mac</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Laptops</span>
            </Link>
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=tablets">
               <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">tablet_mac</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Tablets</span>
            </Link>
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=audio">
               <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">headphones</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Audio</span>
            </Link>
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=wearables">
               <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">watch</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Wearables</span>
            </Link>
            <Link className="bg-surface border border-outline-variant hover:border-primary hover:glow-primary rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-2" to="/products?category=smarthome">
               <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors duration-300">router</span>
              </div>
              <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">Smart Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="py-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-md fade-in-up">
          <h2 className="font-headline-lg text-on-surface mb-4">Our Products</h2>
          <div className="flex space-x-2 border-b border-outline-variant">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-label-md transition-colors relative overflow-hidden ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_8px_rgba(185,199,228,0.8)]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Simulating changing content based on tab with a key to re-trigger animation */}
        <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-children">
          {/* Standard Product Cards */}
          <Link to="/products/1" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img alt="Phone" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800" />
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">visibility</span></button>
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">favorite</span></button>
              </div>
            </div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-label-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">Samsung Galaxy S24 Ultra</h3>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">star_half</span>
              <span className="text-[10px] text-on-surface-variant ml-1">(124)</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-headline-md text-primary">31.990.000 ₫</span>
              <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" onClick={(e) => { e.preventDefault(); addToCart({id: 2, name: 'Samsung Galaxy S24 Ultra', price: 31990000, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800'}, 1); }}><span className="material-symbols-outlined">add_shopping_cart</span></button>
            </div>
          </Link>
          
          <Link to="/products/2" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img alt="Laptop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" />
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">visibility</span></button>
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">favorite</span></button>
              </div>
            </div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-label-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">Laptop ASUS ROG Strix G15</h3>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="text-[10px] text-on-surface-variant ml-1">(56)</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-headline-md text-primary">25.990.000 ₫</span>
              <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" onClick={(e) => { e.preventDefault(); addToCart({id: 4, name: 'Laptop ASUS ROG Strix G15', price: 25990000, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800'}, 1); }}><span className="material-symbols-outlined">add_shopping_cart</span></button>
            </div>
          </Link>
          
          <Link to="/products/3" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift hidden sm:block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img alt="Tablet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" />
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">visibility</span></button>
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">favorite</span></button>
              </div>
            </div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-label-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">iPad Pro M4 11 inch 256GB</h3>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">star_outline</span>
              <span className="text-[10px] text-on-surface-variant ml-1">(89)</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-headline-md text-primary">28.990.000 ₫</span>
              <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" onClick={(e) => { e.preventDefault(); addToCart({id: 5, name: 'iPad Pro M4 11 inch 256GB', price: 28990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'}, 1); }}><span className="material-symbols-outlined">add_shopping_cart</span></button>
            </div>
          </Link>
          
          <Link to="/products/4" className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors group hover-lift hidden lg:block">
            <div className="relative aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img alt="Camera" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1516681100242-7eb69ced17a6?auto=format&fit=crop&q=80&w=800" />
              <div className="absolute inset-0 bg-surface/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">visibility</span></button>
                <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-fixed shadow-[0_0_15px_rgba(185,199,228,0.4)] mx-1 hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); }}><span className="material-symbols-outlined">favorite</span></button>
              </div>
            </div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-label-md text-on-surface line-clamp-2 group-hover:text-primary transition-colors">Camera IP 360 Xiaomi Mi Home</h3>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star</span>
              <span className="material-symbols-outlined text-[14px] text-[#FFB400] filled">star_half</span>
              <span className="text-[10px] text-on-surface-variant ml-1">(42)</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-headline-md text-primary">690.000 ₫</span>
              <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" onClick={(e) => { e.preventDefault(); addToCart({id: 10, name: 'Camera IP 360 Xiaomi Mi Home', price: 690000, image: 'https://images.unsplash.com/photo-1516681100242-7eb69ced17a6?auto=format&fit=crop&q=80&w=800'}, 1); }}><span className="material-symbols-outlined">add_shopping_cart</span></button>
            </div>
          </Link>
        </div>
        
        <div className="flex justify-center mt-8 fade-in-up">
          <Link to="/products" className="border border-outline hover:border-primary text-on-surface hover:text-primary px-8 py-2.5 rounded-md font-label-md transition-all hover:shadow-[0_0_15px_rgba(185,199,228,0.15)] btn-ripple">Load More</Link>
        </div>
      </section>

      {/* Tech News / Blog */}
      <section className="bg-surface-container-low py-lg px-margin-mobile md:px-margin-desktop border-t border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-md fade-in-up">
            <h2 className="font-headline-lg text-on-surface">Tech Insights</h2>
            <Link className="text-primary font-label-md hover:underline hidden sm:flex items-center group" to="/news">
              Read Journal <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter stagger-children">
            {/* Blog Card 1 */}
            <Link to="/news/1" className="bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:glow-primary transition-all duration-300 group hover-lift block">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-surface/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img alt="Circuit Board" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF8TTgOkRG3JsJDPwejczLcbcVaIed6fByBXQOVwz-1z12nK19KSXu8LbNRh0ZUMPMhp2-pSsiO8-pQf62JNWWnNkzwtgMNZMaDD8bcV-6GtHQll5nq84YRULPSfNJGOQ9BFmQ7W2gVwOtdoz1wd9s9drctRW4ZIF2C0cHCbyR2rmq_cE9IlCXpbfq1Ftl1N-Irg7YpA2oSEJOyi82ybPoHTPbfZGlkWtzvwMYntmZU_L3GGZdWy-JEAB68X_62PdyF7bJ2KpRZwDh" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">Hardware</span>
                  <span className="text-[10px] text-on-surface-variant">Oct 24, 2024</span>
                </div>
                <h3 className="font-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">The Future of Quantum Computing Processors</h3>
                <p className="font-body-md text-on-surface-variant line-clamp-2 mb-4">A deep dive into how new architectural approaches are making quantum supremacy a reality sooner than expected.</p>
                <span className="text-primary font-label-md flex items-center group-hover:underline">Read More <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
              </div>
            </Link>
            
            {/* Blog Card 2 */}
            <Link to="/news/2" className="bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:glow-primary transition-all duration-300 group hover-lift block">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-surface/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img alt="Retro Tech" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtQgbkyVfxHzPGeLJwL74lx0BgqRpvxELw8MwtMbRDXCBcdyjw9YK1jpToXgz796i9Pf5s-3xTbEZ0zPZe05cg8mB_PUAzUVEf6XU-Drp-xKnk3m7Plxu6Nw8zz5TTNPtOtL3P4UHD6RTPcTm4AmKGnW7pKdzeE69NP47oKWuWEraEWn7o-ejFsSsqWZ9vL23foN0OpU--m5-LJ1a9qsqC6d6QwU4KxVLNNsGLASnC_qSAjIYfR_9ZCurOFIvRvN0Giyo5fgAiSlVe" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">Reviews</span>
                  <span className="text-[10px] text-on-surface-variant">Oct 22, 2024</span>
                </div>
                <h3 className="font-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">Nexus Z Fold: Is it Worth the Hype?</h3>
                <p className="font-body-md text-on-surface-variant line-clamp-2 mb-4">We spent a month with the latest foldable to see if the durability and software live up to the premium price tag.</p>
                <span className="text-primary font-label-md flex items-center group-hover:underline">Read More <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
              </div>
            </Link>
            
            {/* Blog Card 3 */}
            <Link to="/news/3" className="bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:glow-primary transition-all duration-300 group hover-lift hidden md:block">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-surface/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img alt="Smart Home" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe_cURnupUl1NAF7Hoj6BqLNV-cv88_5JmLIUCwfoMJAR40ISwqVNw4FEaX5qcHZl4xsqs0Hyyiqd9kRqLacBkPQKnpMo2IH1c9x6nFV5xQsbJAdhTVrKe8uoX1aMi7ec5WXfksFatXcZJmSyk_DWWXMLTYt1efxj4WYEmuPKxuQ0ckmPTh-qZ1qrgN-31IsdeDyeE93hgKPb6p8RsutLWAO_szRmpgjAfK1D_szrxRslQ14oMQD0aqi7zE9V79UX17gvFC8mq4wfG" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">Guides</span>
                  <span className="text-[10px] text-on-surface-variant">Oct 18, 2024</span>
                </div>
                <h3 className="font-headline-md text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">Building the Ultimate Smart Home Hub</h3>
                <p className="font-body-md text-on-surface-variant line-clamp-2 mb-4">Step-by-step instructions on connecting disparate protocols into a unified, secure home automation system.</p>
                <span className="text-primary font-label-md flex items-center group-hover:underline">Read More <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
