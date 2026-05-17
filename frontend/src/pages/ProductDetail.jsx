import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContextValue';
import productApi from '../api/productApi';
import { mockProducts } from '../data/mockProducts';

const galleryImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Tj12Rg3fSuQEffZBuNYVTKO3fUO98nMOOarCMBOM3KKLjcXP1NQd6b3RvO59i3kv-nguk1LrWC_tjkvID33d4Z4r0HLirzoh1PVSu5Bt0PuCCZ5HBbAKfILew_oDdDjeY_kS1R-AvtOuH42QD3JaApTxyEIXB1bcjk96nm_3bOj_ycib7NEOuOoJNXAhAilpwRsiqcJVMQRhmD-MVT5XzjyPI6u6VBx8ifBTwvJZQP_t2gGHuMwCY8Rh-QXIPcx2LjI4noPDfQQO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4BXfhhqMPKzq33eZ5C0dr2-0tZC-vZL7JJc9YiUbLLG86enb-9yIZ5lOJQt9QCGTgDx1QFsq9jF_UfjsZubgVGPxmLL49Safoa2ju94Rq0LCyUR61bponLqWTY827qTbnHthNjV_6360NC0rn3iShY8hdoVmOrjGVBLVBcOSiea9gPyGJcw7W63lFlaRLa3-4jA8NYewj575FYtb4l5ynSo0teiLZFx3_TPPEhGOItVJPgaOc0ysA311RBsjEHt-t0mzbE8fT9ZII",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIbjxZwDALzIvxJEKb_Wvgki1yxbdmz8iT9Ff3n6yxdEw6c2futeW1pwWXHXToe6wIOBy1aUWzNkJZXZATtTO-A77ZjNCH4Y-TSmI87LvXSi02wKUqO7aafTp8wZ1QmquWF9nuTZCJihY0HvNAWm0yefbPsH_r_VKBl5ZohS6cFMV53b0NE7JfKrGspIQ4w5_oaWfr5o9YQS3kJnx0cR5cir4HeRydyUl-q6kcDFAjmE64r3s3pRVAaGNs6Q6vy_ZZWPlxWYjSEdwP",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKaFeUulBlfVJhHBt_RRBP_uYZKCPqIos9p99Bl3Vpv-7YvzPFsyC5LeaSYf5Nw8QOBp1KwxM_y16GUo7acehO4fKtTDjR47IO7GgKQ2eHL30q0McG0OR6-WUaM3ZdviVUFrx2HhpsddjuX1LtzdWGzRNLuOIabMoMxoJNOA2wcTdbgRm4FwSm5x2aSJWnf7U1uiyu334kZXQF0i1iCYSKVh4Xjf5qDYZh8M85Vte9DwZcZm0u4wL8bUAcF4KZX2QYGRZqstRbHQfO"
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Void Black');
  const [selectedStorage, setSelectedStorage] = useState('2 TB SSD');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // overview, specs, reviews
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productApi.getById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product, falling back to mock data", error);
        const mockProduct = mockProducts.find(p => p.id === Number(id)) || mockProducts[0] || {
          id: id,
          name: 'PrecisionX Pro 16"',
          price: 2499.00,
          category: 'Laptops',
          image: galleryImages[0]
        };
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <main className="flex-grow flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </main>;
  }

  if (!product) {
    return <main className="flex-grow flex items-center justify-center min-h-screen text-xl text-error">Product not found</main>;
  }

  return (
    <main className="flex-grow py-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full page-enter">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center text-label-sm text-on-surface-variant mb-lg fade-in-up">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link className="hover:text-primary transition-colors" to="/products?category=laptops">Laptops</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-primary font-semibold">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Section: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Gallery */}
        <div className="flex flex-col gap-sm">
          <div className="bg-surface-container rounded-xl aspect-[4/3] flex items-center justify-center border border-outline-variant overflow-hidden relative group cursor-crosshair glass">
            <img 
              alt={`${product.name} - Main View`}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out" 
              src={galleryImages[mainImage] || product.image} 
            />
            <div className="absolute top-4 left-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded shadow-[0_0_15px_rgba(185,199,228,0.4)] tracking-wider">NEW</div>
          </div>
          <div className="grid grid-cols-4 gap-sm">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(idx)}
                className={`bg-surface-container rounded-lg aspect-square overflow-hidden transition-all duration-300 relative ${mainImage === idx ? 'border-2 border-primary shadow-[0_0_10px_rgba(185,199,228,0.3)]' : 'border border-outline-variant hover:border-primary/50'}`}
              >
                <img alt={`Thumbnail ${idx + 1}`} className={`w-full h-full object-cover transition-opacity duration-300 ${mainImage === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} src={img} />
                {mainImage === idx && <div className="absolute inset-0 bg-primary/10"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-headline-lg font-bold text-on-surface mb-2 text-glow">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4 cursor-pointer group w-fit" onClick={() => setActiveTab('reviews')}>
            <div className="flex text-[#FFB400] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              <span className="material-symbols-outlined text-[20px]">star_half</span>
            </div>
            <span className="text-label-sm text-on-surface-variant group-hover:text-primary underline transition-colors">4.8 (124 Reviews)</span>
          </div>
          <p className="text-headline-xl font-semibold text-primary mb-6">${(product.price * quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
          <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
            Engineered for absolute performance. The PrecisionX Pro features a next-generation neural processor, an edge-to-edge mini-LED display, and aerospace-grade thermal management.
          </p>

          {/* Options */}
          <div className="mb-6">
            <h3 className="text-label-md font-semibold text-on-surface mb-3 flex items-center justify-between">
              <span>Color: <span className="text-primary ml-1">{selectedColor}</span></span>
            </h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedColor('Void Black')}
                aria-label="Void Black" 
                className={`w-10 h-10 rounded-full bg-black transition-all duration-300 outline-none flex items-center justify-center ${selectedColor === 'Void Black' ? 'border-2 border-primary ring-2 ring-primary/30 shadow-[0_0_15px_rgba(185,199,228,0.3)]' : 'border-2 border-transparent hover:border-outline'}`}
              >
                {selectedColor === 'Void Black' && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
              </button>
              <button 
                onClick={() => setSelectedColor('Titanium Silver')}
                aria-label="Titanium Silver" 
                className={`w-10 h-10 rounded-full bg-gray-400 transition-all duration-300 outline-none flex items-center justify-center ${selectedColor === 'Titanium Silver' ? 'border-2 border-primary ring-2 ring-primary/30 shadow-[0_0_15px_rgba(185,199,228,0.3)]' : 'border-2 border-transparent hover:border-outline'}`}
              >
                 {selectedColor === 'Titanium Silver' && <span className="material-symbols-outlined text-black text-[16px]">check</span>}
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-label-md font-semibold text-on-surface mb-3">Storage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['1 TB SSD', '2 TB SSD', '4 TB SSD'].map(storage => (
                <button 
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`py-3 px-4 rounded font-label-md transition-all duration-300 ${selectedStorage === storage ? 'border border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(185,199,228,0.2)]' : 'border border-outline-variant text-on-surface-variant hover:border-primary/50 hover:text-on-surface'}`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
             <h3 className="text-label-md font-semibold text-on-surface mb-3">Quantity</h3>
             <div className="flex items-center w-32 bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <div className="flex-grow h-10 flex items-center justify-center font-headline-sm text-on-surface border-x border-outline-variant bg-surface-container-low">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
             </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Link to="/checkout" className="flex-1 bg-primary hover:bg-primary-fixed text-on-primary font-bold py-4 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(185,199,228,0.2)] hover:shadow-[0_0_30px_rgba(185,199,228,0.4)] text-label-md uppercase tracking-widest text-center btn-ripple">
              Buy Now
            </Link>
            <button 
              onClick={() => {
                const productToAdd = {
                  ...product,
                  color: selectedColor,
                  storage: selectedStorage
                };
                addToCart(productToAdd, quantity);
              }}
              className="flex-1 bg-surface-container hover:bg-surface-bright border border-outline-variant hover:border-primary text-on-surface font-semibold py-4 px-6 rounded-lg transition-colors text-label-md uppercase tracking-wide flex items-center justify-center gap-2 btn-ripple"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              Add to Cart
            </button>
          </div>
          <div className="mt-6 flex items-center gap-sm text-label-sm text-on-surface-variant bg-surface-container w-fit px-4 py-2 rounded-full border border-outline-variant/50">
            <span className="material-symbols-outlined text-[18px] text-[#00E5FF]">local_shipping</span>
            Free express shipping on orders over $1000.
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-outline-variant mb-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex gap-8">
          {[
            { id: 'overview', label: 'Product Overview' },
            { id: 'specs', label: 'Tech Specs' },
            { id: 'reviews', label: 'Reviews (124)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-headline-sm font-semibold transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-lg shadow-[0_0_10px_rgba(185,199,228,0.8)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] fade-in" key={activeTab}>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl stagger-children">
            <div>
              <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface max-w-none">
                <p className="text-body-lg mb-6 leading-relaxed">
                  The PrecisionX Pro is not just a laptop; it's a mobile workstation designed for creators, developers, and data scientists who demand uncompromised power. Machined from a single block of recycled aluminum, its chassis is both incredibly rigid and astonishingly thin.
                </p>
                <h3 className="text-headline-md font-semibold mt-8 mb-4">Unprecedented Thermal Design</h3>
                <p className="text-body-md mb-6 leading-relaxed">
                  Our patented CryoCore cooling system utilizes a vapor chamber and dual liquid-crystal polymer fans to maintain optimal performance even under sustained heavy loads. Say goodbye to thermal throttling during critical renders or intensive compile sessions.
                </p>
                <h3 className="text-headline-md font-semibold mt-8 mb-4">Pixel-Perfect Display</h3>
                <p className="text-body-md leading-relaxed">
                  The 16-inch Retina Mini-LED display delivers stunning contrast with deep blacks and blinding highlights up to 1600 nits. Factory calibrated for Delta E &lt; 1, it provides the accuracy required for professional color grading and photo editing right out of the box.
                </p>
              </div>
            </div>
            <div>
              <img alt="Laptop internals showing cooling" className="rounded-xl w-full object-cover aspect-video border border-outline-variant hover-lift shadow-[0_0_20px_rgba(0,0,0,0.5)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEPYR057gKc6XxQtk5q2NHqZIgj8Yq2b2J-W8ItH3hSHfjHR7P1H15hIy3Q7jxclG7xlZo8jm0xfokUD5xhHCePig24AkTg8SV5-zAcx367cLafncrX1yv2aIoyVB9R3MaAYWZx44gBnS5avHG9MfhMqZSe0VeCJcB5Kg0dI418AtSaZfSPZ0eX1qYvC_cn2e-ouXxTBEln2-RusFXNXPGAXTkcr3FbIUT8GmljAIL-gFuhPT0H9TXhzWHvkU9uRahIqJE8ZnxEwRp" />
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden max-w-4xl fade-in-up shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <table className="w-full text-left border-collapse">
              <tbody className="text-body-md">
                {[
                  ['Processor', 'Quantum Core M9, 16-core CPU, 40-core GPU'],
                  ['Memory', '64GB LPDDR5X unified memory'],
                  ['Storage', selectedStorage + ' (PCIe Gen 5)'],
                  ['Display', '16" Mini-LED, 3456 x 2234 resolution, 120Hz ProMotion'],
                  ['Battery', '99.9Wh lithium-polymer, up to 22 hours playback'],
                  ['Ports', '3x Thunderbolt 5, HDMI 2.1, SDXC card reader, MagSafe 4'],
                  ['Wireless', 'Wi-Fi 7 (802.11be), Bluetooth 5.4'],
                  ['Weight', '4.7 lbs (2.1 kg)'],
                  ['Materials', '100% recycled aluminum enclosure']
                ].map(([label, value], i) => (
                  <tr key={label} className={`border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors ${i % 2 === 0 ? 'bg-surface-container-low' : ''}`}>
                    <th className="py-4 px-6 font-semibold text-on-surface w-1/3">{label}</th>
                    <td className="py-4 px-6 text-on-surface-variant">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <div>
                <h2 className="text-headline-md font-semibold text-on-surface mb-2">Customer Feedback</h2>
                <div className="flex items-center gap-4">
                  <div className="flex text-[#FFB400]">
                    <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[32px]">star_half</span>
                  </div>
                  <div>
                    <span className="text-headline-md font-bold text-on-surface block">4.8 / 5</span>
                    <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Based on 124 reviews</span>
                  </div>
                </div>
              </div>
              <button className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md py-3 px-6 rounded-lg transition-colors btn-ripple">
                Write a Review
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md stagger-children">
              {/* Review 1 */}
              <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/50 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-surface-container-highest flex items-center justify-center text-on-primary font-headline-sm shadow-inner">JD</div>
                    <div>
                      <p className="text-body-md font-semibold text-on-surface">John D.</p>
                      <p className="text-[12px] text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Verified Buyer - Oct 12, 2024</p>
                    </div>
                  </div>
                  <div className="flex text-[#FFB400] text-sm">
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                </div>
                <h4 className="text-body-lg font-semibold text-on-surface mb-2">Absolute powerhouse</h4>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  I compile massive codebases daily, and this machine hasn't broken a sweat. The keyboard is tactile and responsive, and the battery life is surprisingly good for something this powerful.
                </p>
              </div>

              {/* Review 2 */}
              <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/50 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-surface-container-highest flex items-center justify-center text-on-primary font-headline-sm shadow-inner">SW</div>
                    <div>
                      <p className="text-body-md font-semibold text-on-surface">Sarah W.</p>
                      <p className="text-[12px] text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Verified Buyer - Sep 28, 2024</p>
                    </div>
                  </div>
                  <div className="flex text-[#FFB400] text-sm">
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-[16px]">star</span>
                  </div>
                </div>
                <h4 className="text-body-lg font-semibold text-on-surface mb-2">Incredible display, heavy charger</h4>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  The Mini-LED screen is the best I've ever used for video editing. The colors are spot on. Taking one star off because the power brick is quite bulky, making it slightly less portable than I'd like.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button className="text-primary font-label-md hover:underline btn-ripple px-4 py-2 rounded-lg hover:bg-primary/5">Load More Reviews</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
