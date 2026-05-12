import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import News from './pages/News';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Policies from './pages/Policies';
import RMA from './pages/RMA';
import Login from './pages/Login';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import PaymentFailed from './pages/PaymentFailed';
import SystemLoading from './pages/SystemLoading';
import Maintenance from './pages/Maintenance';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/server-error' || location.pathname === '/loading' || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-body-md bg-background text-on-background">
      {!isAuthPage && <Header />}
      <main className="flex-1 flex flex-col relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/rma" element={<RMA />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/loading" element={<SystemLoading />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
