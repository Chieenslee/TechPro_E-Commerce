import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LanguageToggle from './components/LanguageToggle';
import { AuthContext } from './context/AuthContextValue';

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const Policies = lazy(() => import('./pages/Policies'));
const RMA = lazy(() => import('./pages/RMA'));
const Login = lazy(() => import('./pages/Login'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));
const SystemLoading = lazy(() => import('./pages/SystemLoading'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Admin = lazy(() => import('./pages/Admin'));

function RouteLoading() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-sm text-on-surface-variant">
      <span className="inline-flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        Dang tai...
      </span>
    </div>
  );
}

function AdminRoute() {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/account" replace />;
  }

  return <Admin />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/server-error' || location.pathname === '/loading' || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-body-md bg-background text-on-background">
      {!isAuthPage && <Header />}
      {isAuthPage && (
        <div className="fixed right-4 top-4 z-[100]">
          <LanguageToggle compact />
        </div>
      )}
      <main className="flex-1 flex flex-col relative">
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
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
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
