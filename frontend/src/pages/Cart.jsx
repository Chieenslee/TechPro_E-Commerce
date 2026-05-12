import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotalAmount, cartTotalItems } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cartTotalAmount;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl page-enter">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center fade-in-up">
          <div className="mb-lg relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150"></div>
            <div className="glass-panel w-40 h-40 rounded-full flex items-center justify-center relative z-10 border border-outline-variant/30 shadow-[0_0_20px_rgba(185,199,228,0.1)]">
              <span className="material-symbols-outlined text-[80px] text-primary opacity-70" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24" }}>
                production_quantity_limits
              </span>
            </div>
          </div>
          
          <h1 className="font-headline-lg text-on-surface mb-sm tracking-tight text-glow">
            Chưa có dữ liệu trong giỏ hàng
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-xl opacity-80">
            Hiện tại giỏ hàng của bạn đang trống. Hãy quay lại khám phá những thiết bị công nghệ tiên tiến nhất từ TechPro để trang bị cho không gian làm việc của bạn.
          </p>
          
          <Link to="/products" className="bg-primary text-on-primary font-label-md px-8 py-4 rounded-full inline-flex items-center gap-3 hover:glow-primary-hover transition-all glow-primary btn-ripple">
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Khám phá sản phẩm ngay
          </Link>

          <div className="mt-24 grid grid-cols-3 gap-8 opacity-40">
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-outline uppercase tracking-wider mb-1">Status</span>
              <span className="font-body-md text-on-surface-variant font-mono text-sm">IDLE_STATE</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-outline uppercase tracking-wider mb-1">Session</span>
              <span className="font-body-md text-on-surface-variant font-mono text-sm">SECURE_SYNC</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-outline uppercase tracking-wider mb-1">Latency</span>
              <span className="font-body-md text-on-surface-variant font-mono text-sm">&lt;12ms</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg page-enter">
      <div className="mb-lg flex justify-between items-end fade-in-up">
        <div>
          <h1 className="font-headline-xl text-on-surface mb-xs text-glow">Command Center Cart</h1>
          <p className="font-body-lg text-on-surface-variant">Review your selected hardware specs before deployment.</p>
        </div>
        <button 
          onClick={clearCart}
          className="text-on-surface-variant hover:text-error transition-colors font-label-md underline btn-ripple px-4 py-2 rounded hover:bg-error/10"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-md stagger-children">
          {cartItems.map((item) => (
            <div key={item.id} className="glass rounded-xl p-md flex flex-col sm:flex-row gap-md items-start sm:items-center relative group hover-lift transition-all">
              <div className="w-full sm:w-32 h-32 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 border border-outline-variant/30 relative">
                <img alt={item.name} className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform" src={item.image} />
              </div>
              <div className="flex-grow flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <h3 className="font-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors">{item.name}</h3>
                    <div className="flex gap-xs flex-wrap">
                      {(item.specs || [item.category || item.storage]).filter(Boolean).map(spec => (
                        <span key={spec} className="px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm rounded uppercase border border-outline-variant/50 shadow-[0_0_5px_rgba(0,0,0,0.2)]">{spec}</span>
                      ))}
                    </div>
                  </div>
                  <span className="font-headline-md text-primary font-bold">${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center w-full mt-auto">
                  <div className="flex items-center bg-surface-container-highest border border-outline-variant/30 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="decrease quantity" 
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright rounded-l-lg"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-body-md text-on-surface px-4 py-1 text-center min-w-[3rem] font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="increase quantity" 
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-bright rounded-r-lg"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-on-surface-variant hover:text-error hover:bg-error/10 px-3 py-1.5 rounded transition-colors flex items-center gap-xs font-label-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4 mt-lg lg:mt-0 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass rounded-xl p-md flex flex-col sticky top-28 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
            <h2 className="font-headline-md text-on-surface border-b border-outline-variant/30 pb-sm mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span> Telemetry Summary
            </h2>
            <div className="flex flex-col gap-sm mb-md">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-on-surface-variant">Subtotal ({cartTotalItems} items)</span>
                <span className="font-body-md text-on-surface font-semibold">${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-on-surface-variant">Shipping Matrix</span>
                <span className="font-body-md text-primary">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-on-surface-variant">Estimated Tax</span>
                <span className="font-body-md text-on-surface font-semibold">${tax.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
            </div>
            
            <div className="border-t border-outline-variant/30 pt-sm mb-lg">
              <div className="flex justify-between items-center">
                <span className="font-headline-md text-on-surface">Total Allocation</span>
                <span className="font-headline-lg text-primary text-glow font-bold">${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            {/* Discount Section */}
            <div className="mb-lg">
              <label className="block font-label-md text-on-surface-variant mb-xs" htmlFor="promo_code">Authorization Code</label>
              <div className="flex gap-xs">
                <input 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary tracking-wider transition-colors shadow-inner" 
                  id="promo_code" 
                  placeholder="ENTER-KEY" 
                  type="text" 
                />
                <button className="bg-surface-variant text-on-surface hover:text-primary font-label-md px-4 py-2 rounded-lg border border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-highest transition-colors btn-ripple">Apply</button>
              </div>
            </div>
            
            <Link to="/checkout" className="w-full bg-primary text-on-primary font-headline-sm font-bold py-3.5 rounded-lg flex justify-center items-center gap-sm hover:glow-primary-hover transition-all glow-primary btn-ripple relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-full group-hover:animate-[ticker_1s_ease-in-out]"></div>
              <span className="material-symbols-outlined z-10" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="z-10 tracking-widest uppercase">Initiate Checkout Protocol</span>
            </Link>
            <div className="mt-sm text-center">
              <span className="font-label-sm text-on-surface-variant flex items-center justify-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_5px_rgba(185,199,228,0.8)]"></span>
                Secure 256-bit Encryption Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
