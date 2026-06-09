import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContextValue';
import { AuthContext } from '../context/AuthContextValue';
import orderApi from '../api/orderApi';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('techpro_user') || 'null');
  } catch (error) {
    console.error('Failed to parse checkout user', error);
    return null;
  }
};

const Checkout = () => {
  const { cartItems, cartTotalAmount, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const storedUser = user || getStoredUser();

  const [formData, setFormData] = useState(() => ({
    fullName: storedUser?.fullName || storedUser?.name || '',
    phone: '',
    email: storedUser?.email || '',
    city: '',
    district: '',
    ward: '',
    address: '',
    shipping: 'standard',
    payment: 'cod'
  }));

  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitError, setSubmitError] = useState('');

  const subtotal = cartTotalAmount;
  const shippingFee = formData.shipping === 'express' ? 15.00 : 0.00;
  const discount = 0; // Logic for promo code would go here
  const total = subtotal + shippingFee - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fillDemoCheckout = () => {
    setFormData(prev => ({
      ...prev,
      fullName: user?.fullName || user?.name || 'User Demo',
      phone: '0900000000',
      email: user?.email || 'user.demo@techpro.eng',
      city: 'HCM',
      district: 'D1',
      ward: 'W1',
      address: '1 Nguyen Hue, Ben Nghe',
      shipping: prev.shipping || 'standard',
      payment: prev.payment || 'cod'
    }));
  };

  const buildOrderPayload = () => ({
    customer: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || user?.email || '',
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      address: formData.address
    },
    items: cartItems.map(item => ({
      id: Number(item.id),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || null,
      category: item.category || null,
      storage: item.storage || null
    })),
    subtotal,
    shippingFee,
    discount,
    total,
    shippingMethod: formData.shipping,
    paymentMethod: formData.payment
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty. Please add at least one product before checkout.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const createdOrder = await orderApi.create(buildOrderPayload());
      setOrderNumber(createdOrder.orderNumber);
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Failed to create order', error);
      setSubmitError('Could not sync with backend. A local order was created so you can continue.');
      const fallbackOrderNumber = `TP-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      setOrderNumber(fallbackOrderNumber);
      const localOrders = JSON.parse(localStorage.getItem('techpro_orders') || '[]');
      localStorage.setItem('techpro_orders', JSON.stringify([
        {
          ...buildOrderPayload(),
          orderNumber: fallbackOrderNumber,
          createdAt: new Date().toISOString(),
          status: 'Processing'
        },
        ...localOrders
      ]));
      clearCart();
      setOrderSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl page-enter">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center fade-in-up glass p-xl rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          
          <div className="mb-lg relative z-10">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
            <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 bg-surface border border-primary/50 shadow-[0_0_30px_rgba(185,199,228,0.3)]">
              <span className="material-symbols-outlined text-[64px] text-primary">task_alt</span>
            </div>
          </div>
          
          <h1 className="font-headline-lg text-on-surface mb-sm text-glow relative z-10">
            Deployment Successful!
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-lg relative z-10">
            Your hardware order <span className="text-primary font-mono">#{orderNumber}</span> has been received and is being prepared for dispatch.
          </p>
          
          <div className="flex gap-4 relative z-10">
            <Link to="/products" className="bg-transparent border border-primary text-primary hover:bg-primary/10 font-label-md px-6 py-3 rounded-lg transition-all btn-ripple">
              Continue Shopping
            </Link>
            <Link to="/" className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-lg hover:glow-primary-hover transition-all glow-primary btn-ripple">
              Return to Command Center
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Minimal Header for Checkout */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/30 z-50 py-sm sticky top-0 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between">
          <Link to="/" className="font-headline-md font-bold tracking-tighter text-primary flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">memory</span>
            TechPro
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span className="font-label-md uppercase tracking-widest text-on-surface-variant">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg page-enter">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center fade-in-up">
            <div className="max-w-md w-full glass p-xl rounded-3xl border border-outline-variant/30 text-center flex flex-col items-center gap-md relative z-10 hover-lift shadow-[0_0_40px_rgba(185,199,228,0.05)]">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-sm shadow-inner border border-outline-variant/50 relative group">
                <span className="material-symbols-outlined text-primary text-[40px] opacity-80" style={{ fontVariationSettings: "'wght' 200" }}>shopping_cart_checkout</span>
              </div>
              
              <h1 className="font-headline-lg text-on-surface text-glow">Authentication Required</h1>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-sm">
                You must initialize a secure session to proceed with checkout and secure your telemetry nodes.
              </p>
              
              <div className="flex flex-col w-full gap-3 mt-sm">
                <Link to="/login" state={{ from: '/checkout' }} className="w-full py-3 bg-primary text-on-primary font-label-md rounded-lg glow-primary glow-primary-hover transition-all flex justify-center items-center gap-2 btn-ripple group overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-[150%] group-hover:animate-[ticker_1s_ease-in-out]"></div>
                  <span className="material-symbols-outlined text-[20px] z-10">login</span>
                  <span className="z-10 uppercase tracking-wider text-[12px] font-bold">Initialize Link</span>
                </Link>
                
                <Link to="/login" state={{ mode: 'register', from: '/checkout' }} className="w-full py-3 bg-surface border border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md rounded-lg transition-all flex justify-center items-center gap-2 btn-ripple">
                  <span className="uppercase tracking-wider text-[12px] font-bold">Create Identity</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-8 space-y-md stagger-children">
            {/* Section 1: Customer Information */}
            <section className="glass rounded-xl p-md border border-outline-variant/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
              <div className="flex items-center gap-3 mb-sm border-b border-outline-variant/30 pb-sm">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">person</span>
                <h2 className="font-headline-md text-on-surface">Customer Information</h2>
                <button
                  type="button"
                  onClick={fillDemoCheckout}
                  className="ml-auto rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-label-sm font-semibold text-primary hover:bg-primary hover:text-on-primary transition-colors btn-ripple"
                >
                  Demo Fill
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Enter your full name" type="text" />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono tracking-wider" placeholder="Enter phone number" type="tel" />
                </div>
                <div className="space-y-xs md:col-span-2">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Enter your email" type="email" />
                </div>
              </div>
            </section>

            {/* Section 2: Shipping Address */}
            <section className="glass rounded-xl p-md border border-outline-variant/30 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
              <div className="flex items-center gap-3 mb-sm border-b border-outline-variant/30 pb-sm">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">location_on</span>
                <h2 className="font-headline-md text-on-surface">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">City / Province</label>
                  <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option value="">Select City</option>
                    <option value="HCM">Ho Chi Minh City</option>
                    <option value="HN">Hanoi</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">District</label>
                  <select required name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option value="">Select District</option>
                    <option value="D1">District 1</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Ward</label>
                  <select required name="ward" value={formData.ward} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option value="">Select Ward</option>
                    <option value="W1">Ward 1</option>
                  </select>
                </div>
                <div className="space-y-xs md:col-span-3">
                  <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Detailed Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="House number, street name..." type="text" />
                </div>
              </div>
            </section>

            {/* Section 3: Shipping Method */}
            <section className="glass rounded-xl p-md border border-outline-variant/30 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
              <div className="flex items-center gap-3 mb-sm border-b border-outline-variant/30 pb-sm">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">local_shipping</span>
                <h2 className="font-headline-md text-on-surface">Shipping Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <label className="relative flex cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container p-4 focus:outline-none hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input className="peer sr-only" name="shipping" type="radio" value="standard" checked={formData.shipping === 'standard'} onChange={handleInputChange} />
                  <div className="flex flex-col flex-grow">
                    <span className="font-label-md text-on-surface">Standard Shipping</span>
                    <span className="font-label-sm text-on-surface-variant mt-1">3-5 business days</span>
                  </div>
                  <div className="text-right">
                     <span className="font-label-md text-primary font-bold">Free</span>
                  </div>
                  <span className="material-symbols-outlined text-primary absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container p-4 focus:outline-none hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input className="peer sr-only" name="shipping" type="radio" value="express" checked={formData.shipping === 'express'} onChange={handleInputChange} />
                  <div className="flex flex-col flex-grow">
                    <span className="font-label-md text-on-surface">Express Delivery</span>
                    <span className="font-label-sm text-on-surface-variant mt-1">Delivery within 2 hours</span>
                  </div>
                  <div className="text-right">
                     <span className="font-label-md text-primary font-bold">$15.00</span>
                  </div>
                  <span className="material-symbols-outlined text-primary absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                </label>
              </div>
            </section>

            {/* Section 4: Payment Methods */}
            <section className="glass rounded-xl p-md border border-outline-variant/30 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-focus-within:bg-primary transition-colors"></div>
              <div className="flex items-center gap-3 mb-sm border-b border-outline-variant/30 pb-sm">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">payments</span>
                <h2 className="font-headline-md text-on-surface">Payment Methods</h2>
              </div>
              <div className="space-y-3">
                <label className="relative flex items-center cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container p-4 focus:outline-none hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input className="peer sr-only" name="payment" type="radio" value="cod" checked={formData.payment === 'cod'} onChange={handleInputChange} />
                  <span className="material-symbols-outlined text-on-surface-variant mr-4 text-[24px]">money</span>
                  <span className="font-label-md text-on-surface flex-grow text-[15px]">Cash on Delivery (COD)</span>
                  <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                </label>
                <label className="relative flex items-center cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container p-4 focus:outline-none hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input className="peer sr-only" name="payment" type="radio" value="credit" checked={formData.payment === 'credit'} onChange={handleInputChange} />
                  <span className="material-symbols-outlined text-on-surface-variant mr-4 text-[24px]">credit_card</span>
                  <span className="font-label-md text-on-surface flex-grow text-[15px]">Credit / Debit Card</span>
                  <div className="flex gap-2 mr-3">
                    <span className="text-[10px] font-bold bg-surface px-2 py-0.5 border border-outline-variant/50 rounded">VISA</span>
                    <span className="text-[10px] font-bold bg-surface px-2 py-0.5 border border-outline-variant/50 rounded">MC</span>
                  </div>
                  <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                </label>
                <label className="relative flex items-center cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container p-4 focus:outline-none hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input className="peer sr-only" name="payment" type="radio" value="qr" checked={formData.payment === 'qr'} onChange={handleInputChange} />
                  <span className="material-symbols-outlined text-on-surface-variant mr-4 text-[24px]">qr_code_scanner</span>
                  <span className="font-label-md text-on-surface flex-grow text-[15px]">Crypto / QR Transfer</span>
                  <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-24 glass rounded-xl p-md flex flex-col h-fit border border-primary/20 shadow-[0_0_30px_rgba(185,199,228,0.05)]">
              <h2 className="font-headline-md text-on-surface border-b border-outline-variant/30 pb-sm mb-md flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">receipt_long</span> Order Summary
              </h2>
              {/* Product List */}
              <div className="space-y-sm mb-md flex-grow overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                   <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors">
                     <div className="w-16 h-16 bg-surface-container border border-outline-variant/30 rounded overflow-hidden shrink-0">
                       <img alt={item.name} className="w-full h-full object-cover mix-blend-luminosity" src={item.image} />
                     </div>
                     <div className="flex-grow flex flex-col justify-between">
                       <div>
                         <h3 className="font-label-md text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                         <span className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider">
                           {(item.specs || [item.category || item.storage]).filter(Boolean).join(' / ')}
                         </span>
                       </div>
                       <div className="flex justify-between items-center mt-1">
                         <span className="font-label-sm text-on-surface-variant">Qty: {item.quantity}</span>
                         <span className="font-label-md text-primary font-bold">{item.price.toLocaleString('vi-VN')} ₫</span>
                       </div>
                     </div>
                   </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="flex gap-2 mb-md border-y border-outline-variant/30 py-4">
                <input 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase text-sm tracking-widest" 
                  placeholder="DISCOUNT CODE" 
                  type="text" 
                />
                <button type="button" className="bg-primary/10 border border-primary/50 hover:bg-primary hover:text-on-primary text-primary px-4 py-2 rounded-lg font-label-md transition-colors btn-ripple">APPLY</button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-lg">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-body-md text-on-surface font-semibold">{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-on-surface-variant">Shipping Fee</span>
                  <span className="font-body-md text-on-surface font-semibold">{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center text-[#00E5FF]">
                  <span className="font-body-md">Discount</span>
                  <span className="font-body-md font-semibold">-${discount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-outline-variant/30 pt-sm mb-lg flex justify-between items-end">
                <span className="font-headline-md text-on-surface">Total</span>
                <span className="font-headline-lg text-primary text-glow font-bold">{total.toLocaleString('vi-VN')} ₫</span>
              </div>

              {/* CTA */}
              {submitError && (
                <div className="mb-sm text-error text-label-sm border border-error/30 bg-error/10 rounded-lg px-3 py-2">
                  {submitError}
                </div>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-bold uppercase tracking-widest py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-auto glow-primary btn-ripple disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    EXECUTE ORDER
                  </>
                )}
              </button>
              <p className="font-label-sm text-on-surface-variant text-center mt-sm text-[11px]">
                By executing this order, you agree to our <Link to="#" className="text-primary hover:underline">Terms & Protocols</Link>.
              </p>
            </div>
          </div>
        </form>
        )}
      </main>
    </>
  );
};

export default Checkout;
