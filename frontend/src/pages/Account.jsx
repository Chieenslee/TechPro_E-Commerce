import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';
import { CartContext } from '../context/CartContextValue';
import orderApi from '../api/orderApi';
import productApi from '../api/productApi';
import userApi from '../api/userApi';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
  if (!value) return 'Pending sync';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};

const statusClass = (status) => {
  if (status === 'Delivered') return 'text-primary bg-primary/10 border-primary/20';
  if (status === 'Cancelled') return 'text-error bg-error/10 border-error/20';
  return 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20';
};

const emptyAddress = {
  label: '',
  recipient: '',
  phone: '',
  line1: '',
  city: '',
  isDefault: false
};

const getInitialAddresses = (user) => {
  if (!user?.email) return [];

  const storageKey = `techpro_addresses_${user.email}`;
  const storedAddresses = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (storedAddresses.length > 0) {
    return storedAddresses;
  }

  const defaultAddress = [{
    id: crypto.randomUUID(),
    label: 'Primary Node',
    recipient: user.name || 'TechPro Customer',
    phone: '+1 (555) 019-8234',
    line1: '128 Tech Boulevard, Cyber District',
    city: 'Neo City 90210',
    isDefault: true
  }];
  localStorage.setItem(storageKey, JSON.stringify(defaultAddress));
  return defaultAddress;
};

const Account = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, updateUser } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [profileForm, setProfileForm] = useState(() => ({
    name: user?.name || '',
    email: user?.email || ''
  }));
  const [addresses, setAddresses] = useState(() => getInitialAddresses(user));
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [accountNotice, setAccountNotice] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const apiOrders = await orderApi.getAll({ email: user.email });
        setOrders(apiOrders);
      } catch (error) {
        console.error('Failed to load orders', error);
        const localOrders = JSON.parse(localStorage.getItem('techpro_orders') || '[]')
          .filter(order => order.customer?.email === user.email);
        setOrders(localOrders);
        setOrdersError('Backend orders are unavailable, showing locally stored orders.');
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated || !user?.email) return;

      const storageKey = `techpro_wishlist_${user.email}`;
      const storedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const wishlistIds = storedIds.length > 0 ? storedIds : [1, 2, 3];

      if (storedIds.length === 0) {
        localStorage.setItem(storageKey, JSON.stringify(wishlistIds));
      }

      const products = await Promise.all(
        wishlistIds.map(async (id) => {
          try {
            return await productApi.getById(id);
          } catch {
            return null;
          }
        })
      );
      setWishlist(products.filter(Boolean));
    };

    loadWishlist();
  }, [isAuthenticated, user?.email]);

  const saveAddresses = (nextAddresses) => {
    if (!user?.email) return;
    localStorage.setItem(`techpro_addresses_${user.email}`, JSON.stringify(nextAddresses));
    setAddresses(nextAddresses);
  };

  const handleProfileInput = (event) => {
    const { name, value } = event.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    const updated = await userApi.update(user.id, {
      name: profileForm.name,
      email: profileForm.email,
      role: user.role,
      status: user.status
    });
    updateUser({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status
    });
    setAccountNotice('Profile updated.');
  };

  const handleAddressInput = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetAddressForm = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();
    const nextAddress = {
      ...addressForm,
      id: editingAddressId || crypto.randomUUID()
    };
    const merged = editingAddressId
      ? addresses.map(address => address.id === editingAddressId ? nextAddress : address)
      : [...addresses, nextAddress];
    const normalized = nextAddress.isDefault
      ? merged.map(address => ({ ...address, isDefault: address.id === nextAddress.id }))
      : merged;
    saveAddresses(normalized);
    resetAddressForm();
    setAccountNotice('Address book updated.');
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm(address);
  };

  const handleDeleteAddress = (id) => {
    saveAddresses(addresses.filter(address => address.id !== id));
    if (editingAddressId === id) resetAddressForm();
  };

  const handleRemoveWishlist = (productId) => {
    const nextWishlist = wishlist.filter(product => product.id !== productId);
    localStorage.setItem(`techpro_wishlist_${user.email}`, JSON.stringify(nextWishlist.map(product => product.id)));
    setWishlist(nextWishlist);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-error hover:text-on-error-container hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20 text-left">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md">Terminate Session</span>
          </button>
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
                {accountNotice && (
                  <div className="col-span-1 md:col-span-12 border border-primary/30 bg-primary/10 text-primary rounded-lg px-4 py-3 font-label-md">
                    {accountNotice}
                  </div>
                )}
                
                <div className="col-span-1 md:col-span-8 rounded-2xl p-lg flex flex-col sm:flex-row items-center sm:items-start gap-lg glass border border-primary/20 hover-lift shadow-[0_0_20px_rgba(185,199,228,0.05)]">
                  <div className="w-32 h-32 rounded-full border-[3px] border-primary/50 overflow-hidden flex-shrink-0 relative group shadow-[0_0_15px_rgba(185,199,228,0.3)]">
                    <div className="w-full h-full bg-surface-container flex items-center justify-center bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsf4APjKLjIth74Qt9yskPmX2ALUOVGz0HRF00aTZLWginjnJ3w0_HFveHIosDIL7rtKxUeIcDzMj6w0mI3QuGdIFfLsEhGdYOwjYVGvFi379oj90u3lk_iLm-Jo2iO3XCdpi3lHcyqCh8n260XhrppRZlnM6smc7aYk9L1B04GhO7kId2AgTp_DxyvaI6pXwuUiwxj-BP1MRtaY1lyuH6Ht0S_3h657MTSHsIt3HXm4WbyuhZe3qnZUrYRKdAlxHQI50LjOHxLwHW')" }}></div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="font-headline-md text-on-surface">{user?.name || 'Admin'}</h2>
                    <p className="font-body-md text-on-surface-variant mt-xs font-mono text-sm">{user?.email || 'admin@techpro.eng'}</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg font-label-sm text-primary uppercase tracking-wider shadow-[0_0_10px_rgba(185,199,228,0.2)]">
                        <span className="material-symbols-outlined text-[16px]">stars</span> Platinum Tier
                      </span>
                      <span className="font-body-md text-on-surface-variant sm:border-l sm:border-outline-variant/30 sm:pl-4">Telemetry Points: <strong className="text-primary font-mono text-glow">12,450</strong></span>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('profile')} className="hidden md:flex border border-outline-variant/50 hover:border-primary text-on-surface px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors font-label-md btn-ripple">Edit Profile</button>
                </div>
                
                {/* Saved Address Quick View */}
                <div className="col-span-1 md:col-span-4 rounded-2xl p-lg flex flex-col justify-between glass border border-outline-variant/30 hover-lift">
                  <div>
                    <div className="flex justify-between items-start mb-md">
                      <h3 className="font-body-lg text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-full text-[18px]">home_pin</span> 
                        Primary Node
                      </h3>
                      <button onClick={() => setActiveTab('address')} className="text-primary hover:underline font-label-sm">Manage</button>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 mb-3">
                      <p className="font-body-md text-on-surface font-medium mb-1">{addresses.find(address => address.isDefault)?.label || 'No default address'}</p>
                      <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                        {addresses.find(address => address.isDefault)?.line1 || 'Add a shipping node'}<br/>
                        {addresses.find(address => address.isDefault)?.city || ''}
                      </p>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant flex items-center gap-2 font-mono text-sm">
                    <span className="material-symbols-outlined text-[16px]">phone_iphone</span> {addresses.find(address => address.isDefault)?.phone || 'No phone'}
                  </p>
                </div>
              </section>

              <section className="glass rounded-xl border border-outline-variant/30 p-lg">
                <h2 className="font-headline-sm mb-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">manage_accounts</span>
                  Profile Settings
                </h2>
                <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-sm">
                  <input name="name" value={profileForm.name} onChange={handleProfileInput} required className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" placeholder="Full name" />
                  <input name="email" value={profileForm.email} onChange={handleProfileInput} required type="email" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" placeholder="Email" />
                  <button type="submit" className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md hover:bg-primary-fixed transition-colors">Save</button>
                </form>
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
                      {ordersLoading && (
                        <tr>
                          <td className="py-6 px-md text-on-surface-variant" colSpan="5">Loading deployments...</td>
                        </tr>
                      )}
                      {!ordersLoading && orders.slice(0, 3).map(order => (
                        <tr key={order.orderNumber} className="hover:bg-surface-bright transition-colors group">
                          <td className="py-4 px-md font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#{order.orderNumber}</td>
                          <td className="py-4 px-md text-on-surface-variant">{formatDate(order.createdAt)}</td>
                          <td className="py-4 px-md">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${statusClass(order.status)}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-md font-bold">{formatCurrency(order.total)}</td>
                          <td className="py-4 px-md text-right">
                            <button onClick={() => setActiveTab('orders')} className="text-primary hover:bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-lg text-sm transition-colors btn-ripple">Detail</button>
                          </td>
                        </tr>
                      ))}
                      {!ordersLoading && orders.length === 0 && (
                        <tr>
                          <td className="py-6 px-md text-on-surface-variant" colSpan="5">No deployments yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="fade-in-up">
               <h1 className="font-headline-lg text-on-surface mb-lg text-glow">Order History</h1>
               {ordersError && (
                 <div className="mb-md border border-error/30 bg-error/10 text-error rounded-lg px-4 py-3 font-label-md">
                   {ordersError}
                 </div>
               )}
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
                      {ordersLoading && (
                        <tr>
                          <td className="py-6 px-md text-on-surface-variant" colSpan="5">Loading order history...</td>
                        </tr>
                      )}
                      {!ordersLoading && orders.map(order => (
                        <tr key={order.orderNumber} className="hover:bg-surface-bright transition-colors group align-top">
                          <td className="py-4 px-md">
                            <div className="font-mono text-sm tracking-wider group-hover:text-primary transition-colors">#{order.orderNumber}</div>
                            <div className="text-[11px] text-on-surface-variant mt-1">{order.items?.length || 0} item(s)</div>
                          </td>
                          <td className="py-4 px-md text-on-surface-variant">{formatDate(order.createdAt)}</td>
                          <td className="py-4 px-md">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${statusClass(order.status)}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-md font-bold">{formatCurrency(order.total)}</td>
                          <td className="py-4 px-md text-right">
                            <span className="text-on-surface-variant border border-outline-variant/50 px-4 py-1.5 rounded-lg text-sm">
                              {order.paymentMethod?.toUpperCase()} / {order.shippingMethod}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!ordersLoading && orders.length === 0 && (
                        <tr>
                          <td className="py-6 px-md text-on-surface-variant" colSpan="5">No order history yet. Complete checkout to see orders here.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="fade-in-up">
              <h1 className="font-headline-lg text-on-surface mb-lg text-glow">Wishlist</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter stagger-children">
                {wishlist.map(product => (
                  <div key={product.id} className="glass rounded-xl p-sm group relative overflow-hidden border border-outline-variant/30 hover:border-primary/50 transition-colors hover-lift">
                    <div className="aspect-[4/3] bg-surface-container rounded-lg mb-sm relative flex items-center justify-center p-sm overflow-hidden">
                      <button onClick={() => handleRemoveWishlist(product.id)} className="absolute top-3 right-3 text-error bg-surface/80 backdrop-blur p-1.5 rounded-full z-10 shadow hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                      <img alt={product.name} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" src={product.image} />
                    </div>
                    <div className="px-xs pb-xs">
                      <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">{product.category}</span>
                      <h3 className="font-body-lg text-on-surface truncate font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center justify-between mt-xs">
                        <span className="font-headline-md font-bold text-primary">{formatCurrency(product.price)}</span>
                        <button onClick={() => addToCart(product, 1)} className="text-primary hover:bg-primary hover:text-on-primary border border-primary/30 p-2 rounded-lg transition-colors btn-ripple">
                          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {wishlist.length === 0 && (
                  <div className="col-span-full glass rounded-xl border border-outline-variant/30 p-lg text-on-surface-variant">
                    Wishlist is empty.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
             <div className="fade-in-up">
               <div className="flex justify-between items-center mb-lg">
                 <h1 className="font-headline-lg text-on-surface text-glow">Address Book</h1>
                 <button onClick={resetAddressForm} className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-lg flex items-center gap-2 btn-ripple hover:glow-primary-hover glow-primary">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add New
                 </button>
               </div>

               {accountNotice && (
                 <div className="mb-md border border-primary/30 bg-primary/10 text-primary rounded-lg px-4 py-3 font-label-md">
                   {accountNotice}
                 </div>
               )}

               <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-3 gap-sm mb-lg glass rounded-xl border border-outline-variant/30 p-md">
                 <input name="label" value={addressForm.label} onChange={handleAddressInput} required placeholder="Label" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" />
                 <input name="recipient" value={addressForm.recipient} onChange={handleAddressInput} required placeholder="Recipient" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" />
                 <input name="phone" value={addressForm.phone} onChange={handleAddressInput} required placeholder="Phone" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" />
                 <input name="line1" value={addressForm.line1} onChange={handleAddressInput} required placeholder="Street / building" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary md:col-span-2" />
                 <input name="city" value={addressForm.city} onChange={handleAddressInput} required placeholder="City / postal" className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary" />
                 <label className="flex items-center gap-2 text-on-surface-variant font-label-md">
                   <input name="isDefault" checked={addressForm.isDefault} onChange={handleAddressInput} type="checkbox" />
                   Default address
                 </label>
                 <div className="md:col-span-2 flex gap-sm">
                   <button type="submit" className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md">{editingAddressId ? 'Update Address' : 'Save Address'}</button>
                   {editingAddressId && <button type="button" onClick={resetAddressForm} className="border border-outline-variant px-5 py-2 rounded-lg font-label-md text-on-surface">Cancel</button>}
                 </div>
               </form>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-md stagger-children">
                 {addresses.map(address => (
                 <div key={address.id} className={`rounded-2xl p-lg flex flex-col justify-between glass relative overflow-hidden ${address.isDefault ? 'border border-primary/50' : 'border border-outline-variant/30 hover:border-primary/30 transition-colors'}`}>
                    {address.isDefault && <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">Default</div>}
                    <div>
                      <h3 className="font-body-lg text-on-surface flex items-center gap-2 mb-md">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-full text-[18px]">home_pin</span> 
                        {address.label}
                      </h3>
                      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20 mb-4">
                        <p className="font-body-md text-on-surface font-medium mb-1">{address.recipient}</p>
                        <p className="font-body-md text-on-surface-variant leading-relaxed text-sm">
                          {address.line1}<br/>
                          {address.city}
                        </p>
                        <p className="font-body-md text-on-surface-variant flex items-center gap-2 font-mono text-sm mt-3 pt-3 border-t border-outline-variant/20">
                          <span className="material-symbols-outlined text-[16px]">phone_iphone</span> {address.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => handleEditAddress(address)} className="flex-1 bg-surface-bright border border-outline-variant hover:border-primary text-on-surface font-label-md py-2 rounded-lg transition-colors btn-ripple">Edit</button>
                       <button onClick={() => handleDeleteAddress(address.id)} className="px-4 bg-error/10 border border-error/20 text-error hover:bg-error hover:text-on-error font-label-md py-2 rounded-lg transition-colors btn-ripple"><span className="material-symbols-outlined text-[18px] block">delete</span></button>
                    </div>
                 </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Account;
