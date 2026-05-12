import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartTotalItems } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navCategories = [
    { label: 'Phones', path: '/products?category=phones', icon: 'expand_more', subcategories: ['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi', 'Oppo'] },
    { label: 'Laptops', path: '/products?category=laptops', icon: 'expand_more', subcategories: ['MacBook', 'ASUS ROG', 'MSI', 'Dell XPS', 'Lenovo ThinkPad'] },
    { label: 'Tablets', path: '/products?category=tablets', icon: 'expand_more', subcategories: ['Apple iPad', 'Samsung Galaxy Tab', 'Microsoft Surface', 'Lenovo Tab'] },
    { label: 'Audio', path: '/products?category=audio', icon: 'expand_more', subcategories: ['Headphones', 'Earbuds', 'Speakers', 'Microphones'] },
    { label: 'Accessories', path: '/products?category=accessories', icon: 'expand_more', subcategories: ['Keyboards', 'Mice', 'Cables', 'Chargers', 'Cases'] },
    { label: 'Smart Home', path: '/products?category=smarthome', icon: 'expand_more', subcategories: ['Security Cameras', 'Smart Bulbs', 'Smart Plugs', 'Voice Assistants'] },
  ];

  const mobileLinks = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Products', path: '/products', icon: 'inventory_2' },
    { label: 'Cart', path: '/cart', icon: 'shopping_cart' },
    { label: 'Account', path: '/account', icon: 'account_circle' },
    { label: 'News', path: '/news', icon: 'newspaper' },
    { label: 'About', path: '/about', icon: 'info' },
    { label: 'Contact', path: '/contact', icon: 'mail' },
    { label: 'Services', path: '/services', icon: 'build' },
  ];

  return (
    <header className={`bg-surface border-b border-outline-variant sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
      <div className="px-margin-mobile md:px-margin-desktop py-base">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-md">
          {/* Logo */}
          <Link className="flex items-center shrink-0" to="/">
            <img
              alt="TechPro Logo"
              className="h-10 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsesC23xB0AHobEtRm5UQaqlhjIA1Zp2w59yQTn_Qa30C9ScN--NN0tUiav32Ky8r7xICDLxy_WQ-jJan9xSAyYkouRWf34aTZS_m-GASvr8GJEE_wX35SIEWhsUzBu9Jk1G54dIkJEZe441Ss9CRJhyydNSSnvRyj2MWCBdMQOiahGvZMs-MH6Df7jHQT1fmzj5djYGEcl5NZOkyBfk-4qWlySAFxO7vUgrk04jiq6ICc9iPjRiXrMu7cb79y4SR7nibkmBB_dD0A"
            />
          </Link>

          {/* Smart Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input
              className="w-full bg-surface-container border border-outline-variant rounded-full py-2 pl-4 pr-10 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
              placeholder="Search for products, categories..."
              type="text"
            />
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant cursor-pointer hover:text-primary text-[20px]">search</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-md">
            <button className="md:hidden text-on-surface hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>

            <Link
              className="text-on-surface hover:text-primary transition-colors flex items-center relative"
              to="/cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">{cartTotalItems}</span>
              )}
            </Link>

            <Link
              className="text-on-surface hover:text-primary transition-colors hidden md:flex items-center"
              to="/account"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>

            <button
              className="md:hidden text-on-surface hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu (Desktop) */}
      <nav className="hidden md:block bg-surface-container-low border-t border-outline-variant px-margin-desktop">
        <div className="max-w-7xl mx-auto flex space-x-lg text-on-surface font-label-md">
          {navCategories.map((cat) => (
            <div key={cat.label} className="relative group">
              <Link
                className={`hover:text-primary transition-colors flex items-center h-full py-3 ${location.pathname + location.search === cat.path ? 'text-primary' : ''}`}
                to={cat.path}
              >
                {cat.label}
                {cat.icon && (
                  <span className="material-symbols-outlined text-[16px] ml-1 group-hover:rotate-180 transition-transform duration-200">
                    {cat.icon}
                  </span>
                )}
              </Link>
              {cat.subcategories && (
                <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-surface-container-high border border-outline-variant rounded-b-lg shadow-xl py-2 min-w-[200px] z-50">
                  {cat.subcategories.map(sub => (
                    <Link key={sub} to={`${cat.path}&brand=${sub.toLowerCase().replace(/\s+/g, '-')}`} className="px-4 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors font-body-md text-body-md">
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container border-t border-outline-variant">
          {/* Mobile Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <input
                className="w-full bg-surface border border-outline-variant rounded-full py-2 pl-4 pr-10 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="Search products..."
                type="text"
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
            </div>
          </div>
          {/* Mobile Nav Links */}
          <nav className="px-4 pb-4 space-y-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-label-md ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
