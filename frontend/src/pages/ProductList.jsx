import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import { CartContext } from '../context/CartContextValue';
import productApi from '../api/productApi';

const ProductList = () => {
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // for mobile
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRams, setSelectedRams] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [activeSidebarIcon, setActiveSidebarIcon] = useState(null); // 'shipping' | 'warranty' | 'return' | null
  const [sortBy, setSortBy] = useState('Newest');
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const queryParam = searchParams.get('q') || '';
  const itemsPerPage = viewMode === 'grid' ? 9 : 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.getAll();
        const productItems = Array.isArray(data) ? data : data?.items || data?.data || [];
        setProducts(productItems.length ? productItems : mockProducts); 
      } catch (error) {
        console.error("Failed to fetch products, falling back to mock data", error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedBrand = brandParam?.toLowerCase().replace(/-/g, ' ') || '';
    const normalizedQuery = queryParam.toLowerCase().trim();

    const filtered = products.filter((product) => {
      const syntheticRam = ['8GB', '16GB', '32GB', '64GB'][product.id % 4];
      const productText = `${product.name} ${product.category} ${product.sku} ${product.tags?.join(' ') || ''} ${syntheticRam}`.toLowerCase();
      const matchesCategory = !categoryParam || product.category === categoryParam;
      const matchesBrand = !normalizedBrand || productText.includes(normalizedBrand);
      const matchesSearch = !normalizedQuery || productText.includes(normalizedQuery);
      const matchesBrandFilter = selectedBrands.length === 0 || selectedBrands.some(brand => productText.includes(brand.toLowerCase()));
      const matchesRam = selectedRams.length === 0 || selectedRams.some(ram => productText.includes(ram.toLowerCase()));
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesBrand && matchesSearch && matchesBrandFilter && matchesRam && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Best Rated') return Number(b.rating) - Number(a.rating);
      return b.id - a.id;
    });
  }, [brandParam, categoryParam, maxPrice, products, queryParam, selectedBrands, selectedRams, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleProducts = filteredProducts.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  const animateKey = `${categoryParam || 'all'}-${brandParam || 'all'}-${queryParam}-${sortBy}-${viewMode}-${safeCurrentPage}-${selectedBrands.join('.')}-${selectedRams.join('.')}-${maxPrice}`;

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(1);
  };

  const toggleRam = (ram) => {
    setSelectedRams(prev => prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]);
    setCurrentPage(1);
  };

  const categoryName = categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : queryParam ? `Search: ${queryParam}` : 'All Products';

  if (isSearchEmpty || (filteredProducts.length === 0 && (categoryParam || brandParam || queryParam || selectedBrands.length || selectedRams.length || maxPrice < 5000))) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center py-xl px-margin-mobile md:px-margin-desktop w-full max-w-[1440px] mx-auto page-enter">
        <div className="w-full flex justify-end mb-4">
          <button 
            onClick={() => setIsSearchEmpty(false)}
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md underline"
          >
            Show Normal List
          </button>
        </div>
        
        {/* Empty State Section */}
        <section className="flex flex-col items-center text-center max-w-2xl w-full mb-xl fade-in-up">
          <div className="mb-lg relative flex items-center justify-center w-32 h-32 rounded-full glass">
            <span className="material-symbols-outlined text-[64px] text-primary opacity-80" style={{ fontVariationSettings: "'wght' 200" }}>manage_search</span>
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-50" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <h1 className="font-headline-lg text-on-surface mb-sm">
            Không tìm thấy kết quả phù hợp cho "{queryParam || brandParam || categoryParam || 'tìm kiếm của bạn'}"
          </h1>
          <p className="font-body-md text-on-surface-variant mb-lg">
            Hệ thống không tìm thấy thông số kỹ thuật hoặc sản phẩm nào khớp với truy vấn của bạn. Vui lòng kiểm tra lại chính tả, sử dụng mã sản phẩm chung chung hơn, hoặc thử các từ khóa khác.
          </p>

          <div className="w-full max-w-md relative mb-md hover-lift">
            <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all w-full shadow-[0_0_15px_rgba(185,199,228,0.05)] focus-within:shadow-[0_0_20px_rgba(185,199,228,0.15)]">
              <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
              <input className="bg-transparent border-none text-on-surface focus:outline-none w-full font-body-md tracking-wider placeholder-on-surface-variant/50" defaultValue={queryParam} placeholder="Nhập mã sản phẩm, ví dụ: X-200" type="text" />
              <Link to="/products" className="bg-primary text-on-primary rounded px-4 py-1 ml-2 font-label-md transition-all hover:bg-primary-fixed btn-ripple">Reset</Link>
            </div>
          </div>

          <div className="flex gap-sm">
            <Link to="/products"
              className="bg-transparent border border-outline-variant text-on-surface rounded-lg px-6 py-2 font-label-md hover:bg-surface-variant transition-colors btn-ripple"
            >
              Xem tất cả danh mục
            </Link>
            <button className="text-primary hover:text-primary-fixed transition-colors font-label-md flex items-center gap-xs btn-ripple px-4 py-2 rounded-lg hover:bg-primary/10">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Hỗ trợ trực tuyến
            </button>
          </div>
        </section>

        <section className="w-full mt-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-md border-b border-outline-variant/20 pb-sm">
            <h2 className="font-headline-md text-on-surface">Sản phẩm gợi ý cho bạn</h2>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Dựa trên lịch sử</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-children">
            {mockProducts.slice(0, 4).map(product => (
               <article key={product.id} className="glass rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-300 relative flex flex-col h-full hover-lift">
               <div className="absolute top-sm right-sm flex items-center gap-xs z-10 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-full border border-outline-variant/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                 <div className="w-2 h-2 rounded-full bg-[#00E5FF] pulse-ring"></div>
                 <span className="font-label-sm text-on-surface text-[10px]">IN STOCK</span>
               </div>
               <div className="h-48 w-full bg-surface-dim relative overflow-hidden">
                 <img alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110" src={product.image} />
               </div>
               <div className="p-4 flex flex-col flex-grow">
                 <div className="flex gap-2 mb-2">
                   <span className="bg-surface-container text-on-surface-variant border border-outline-variant/30 rounded px-1.5 py-0.5 text-[10px] font-label-sm uppercase tracking-wider">{product.category}</span>
                 </div>
                 <h3 className="font-headline-sm font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                 <p className="font-label-md text-primary mb-3">${product.price}</p>
                 <div className="mt-auto">
                   <button 
                     onClick={() => addToCart(product, 1)}
                     className="w-full border border-outline-variant/50 text-on-surface hover:border-primary hover:bg-primary/10 hover:text-primary rounded-lg py-2 font-label-md transition-colors flex items-center justify-center gap-2 btn-ripple"
                   >
                     <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                     Thêm vào giỏ
                   </button>
                 </div>
               </div>
             </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <aside className="fixed left-0 top-20 h-screen hidden lg:flex flex-col items-center py-md bg-surface-container w-16 border-r border-outline-variant/30 z-40">
        <div className="flex flex-col items-center gap-lg w-full">
          <button 
            onClick={() => setActiveSidebarIcon(activeSidebarIcon === 'shipping' ? null : 'shipping')}
            className={`w-full flex justify-center py-sm transition-all group relative ${activeSidebarIcon === 'shipping' ? 'text-primary bg-primary/10 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`} title="Free Shipping"
          >
            <span className={`material-symbols-outlined text-[24px] transition-transform ${activeSidebarIcon === 'shipping' ? 'scale-110' : 'group-hover:scale-110'}`}>local_shipping</span>
          </button>
          <button 
            onClick={() => setActiveSidebarIcon(activeSidebarIcon === 'warranty' ? null : 'warranty')}
            className={`w-full flex justify-center py-sm transition-all group relative ${activeSidebarIcon === 'warranty' ? 'text-primary bg-primary/10 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`} title="Warranty"
          >
            <span className={`material-symbols-outlined text-[24px] transition-transform ${activeSidebarIcon === 'warranty' ? 'scale-110' : 'group-hover:scale-110'}`}>verified</span>
          </button>
          <button 
            onClick={() => setActiveSidebarIcon(activeSidebarIcon === 'return' ? null : 'return')}
            className={`w-full flex justify-center py-sm transition-all group relative ${activeSidebarIcon === 'return' ? 'text-primary bg-primary/10 shadow-[inset_2px_0_0_0_#B9C7E4]' : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'}`} title="Easy Returns"
          >
            <span className={`material-symbols-outlined text-[24px] transition-transform ${activeSidebarIcon === 'return' ? 'scale-110' : 'group-hover:scale-110'}`}>assignment_return</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-margin-mobile md:px-margin-desktop lg:pl-[calc(64px+64px)] py-md lg:py-lg page-enter">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-4 fade-in-up">
          <nav className="flex items-center text-on-surface-variant font-label-md">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <span className="material-symbols-outlined text-[16px] mx-xs">chevron_right</span>
            <span className="text-primary font-bold">{categoryName}</span>
          </nav>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden text-on-surface border border-outline-variant px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> Filters
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchEmpty(true)}
                className="text-on-surface-variant hover:text-primary transition-colors font-label-md underline hidden lg:block"
              >
                Test Empty Search
              </button>
              
              <div className="hidden sm:flex items-center bg-surface-container rounded border border-outline-variant p-0.5">
                <button onClick={() => { setViewMode('grid'); setCurrentPage(1); }} className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-surface text-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button onClick={() => { setViewMode('list'); setCurrentPage(1); }} className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-surface text-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant font-label-md hidden sm:block">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-surface-container border border-outline-variant rounded py-1.5 pl-3 pr-8 text-on-surface font-label-md focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-colors"
                >
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-gutter">
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-64 flex-shrink-0 space-y-md md:block ${isFilterOpen ? 'block fade-in' : 'hidden'}`}>
            <div className="bg-surface-container rounded-lg p-md border border-outline-variant/30 sticky top-24">
              <h3 className="font-headline-sm font-semibold mb-md text-on-surface border-b border-outline-variant/30 pb-sm flex justify-between items-center">
                Filters
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              </h3>
              
              <div className="mb-lg">
                <h4 className="font-label-md font-semibold mb-sm text-on-surface uppercase tracking-wider text-[12px]">Brands</h4>
                <div className="space-y-2">
                  {['Apple', 'ASUS', 'MSI', 'Dell'].map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          checked={selectedBrands.includes(brand)} 
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded bg-surface border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface-container appearance-none transition-colors checked:bg-primary checked:border-primary" 
                          type="checkbox" 
                        />
                        <span className="material-symbols-outlined absolute text-[14px] text-on-primary pointer-events-none opacity-0 group-has-[:checked]:opacity-100 transition-opacity" style={{left: '1px'}}>check</span>
                      </div>
                      <span className={`font-body-md transition-colors ${selectedBrands.includes(brand) ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-lg">
                <h4 className="font-label-md font-semibold mb-sm text-on-surface uppercase tracking-wider text-[12px]">RAM</h4>
                <div className="flex flex-wrap gap-2">
                  {['8GB', '16GB', '32GB', '64GB'].map(ram => (
                    <button 
                      key={ram}
                      onClick={() => toggleRam(ram)}
                      className={`px-3 py-1.5 rounded font-label-sm transition-all duration-200 ${selectedRams.includes(ram) ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(185,199,228,0.2)]' : 'border-outline-variant border text-on-surface-variant hover:border-primary/50 hover:text-on-surface'}`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-label-md font-semibold mb-sm text-on-surface uppercase tracking-wider text-[12px]">Price Range</h4>
                <div className="px-2">
                  <input type="range" className="w-full accent-primary" min="0" max="5000" value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }} />
                  <div className="flex justify-between text-[12px] text-on-surface-variant mt-2">
                    <span>$0</span>
                    <span className="text-primary font-bold">${maxPrice.toLocaleString('en-US')}</span>
                    <span>$5k+</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid / List */}
          <div className="flex-grow flex flex-col">
            <div key={animateKey} className={`grid gap-gutter stagger-children mb-xl ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {loading && (
                <div className="col-span-full flex justify-center py-xl">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              {!loading && visibleProducts.map((product) => (
                <article key={product.id} className={`glass rounded-lg border border-white/10 overflow-hidden group hover:border-primary/50 transition-colors duration-300 relative hover-lift flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row h-48'}`}>
                  <div className="absolute top-sm left-sm z-10 flex flex-col gap-xs">
                    {product.onSale && <span className="bg-error/20 text-error font-label-sm px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm border border-error/30 shadow-[0_0_10px_rgba(255,180,171,0.2)]">Sale</span>}
                    {product.isNew && <span className="bg-primary/20 text-primary font-label-sm px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm border border-primary/30 shadow-[0_0_10px_rgba(185,199,228,0.2)]">New</span>}
                  </div>
                  
                  <Link to={`/products/${product.id}`} className={`block bg-surface-dim relative overflow-hidden flex items-center justify-center ${viewMode === 'grid' ? 'aspect-[4/3] p-md' : 'w-48 shrink-0 p-4'}`}>
                    <div className="w-full h-full bg-cover bg-center rounded opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform" 
                         style={{backgroundImage: `url('${product.image}')`}}></div>
                  </Link>
                  
                  <div className={`p-md flex flex-col flex-grow ${viewMode === 'list' ? 'justify-center border-l border-white/5' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-label-sm text-on-surface-variant tracking-widest text-[10px] uppercase">SKU: {product.sku}</p>
                      <div className="flex items-center gap-1 text-secondary-fixed-dim">
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1", color: '#FFB400'}}>star</span>
                        <span className="font-label-sm ml-0.5 text-on-surface-variant">{product.rating}</span>
                      </div>
                    </div>
                    
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-body-lg font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    
                    {viewMode === 'list' && (
                      <p className="font-body-md text-on-surface-variant mb-4 line-clamp-2">High-performance specifications with advanced cooling system. Perfect for demanding workflows and gaming.</p>
                    )}
                    
                    <div className={`flex items-center mt-auto ${viewMode === 'grid' ? 'justify-between mb-md' : 'gap-4 mb-0'}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-md font-bold text-primary text-glow">${product.price}</span>
                        {product.onSale && <span className="font-body-md text-on-surface-variant line-through decoration-error/50">${product.originalPrice}</span>}
                      </div>
                      {viewMode === 'list' && (
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-on-primary border border-primary/30 rounded py-2 px-6 font-label-md transition-colors flex items-center gap-2 btn-ripple ml-auto"
                        >
                          <span className="material-symbols-outlined text-[20px]">shopping_cart</span> Add to Cart
                        </button>
                      )}
                    </div>
                    
                    {viewMode === 'grid' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="flex-grow bg-primary/10 hover:bg-primary hover:text-on-primary text-primary border border-primary/30 rounded py-2 font-label-md transition-all duration-300 flex items-center justify-center gap-2 btn-ripple"
                        >
                          <span className="material-symbols-outlined text-[20px]">shopping_cart</span> Add
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-auto pt-8 border-t border-outline-variant/20 flex justify-center fade-in-up">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {Array.from({ length: Math.min(3, totalPages) }, (_, index) => index + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded font-label-md transition-all ${safeCurrentPage === page ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(185,199,228,0.3)]' : 'border border-outline-variant text-on-surface hover:border-primary hover:text-primary'}`}
                  >
                    {page}
                  </button>
                ))}
                
                {totalPages > 3 && <span className="text-on-surface-variant px-2">...</span>}
                {totalPages > 3 && (
                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-10 h-10 flex items-center justify-center rounded font-label-md transition-all ${safeCurrentPage === totalPages ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(185,199,228,0.3)]' : 'border border-outline-variant text-on-surface hover:border-primary hover:text-primary'}`}
                  >
                    {totalPages}
                  </button>
                )}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-outline-variant disabled:hover:text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductList;
