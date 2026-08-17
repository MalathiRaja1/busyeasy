import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getProducts } from './services/api';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import { useTranslation } from 'react-i18next';
import Wishlist from './pages/Wishlist';
import { Toaster } from 'react-hot-toast';
import AdminCoupons from './pages/AdminCoupons';
import AdminDashboard from './pages/AdminDashboard';
import CategoryNav from './components/CategoryNav';
import FilterSidebar from './components/FilterSidebar';
import SortDropdown from './components/SortDropdown';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import BannerCarousel from './components/BannerCarousel';
import SupportWidget from './components/SupportWidget';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import { useSelector } from 'react-redux';
import { trackPageView } from './utils/analytics';

import './App.css';

function Home({ products, error, reloadProducts, searchTerm, selectedCategory, categoryMatch, onSelectCategory }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ maxPrice: 100000, categories: [], inStockOnly: false });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
        setLoading(true);
    reloadProducts();
  }, [location.pathname]);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  let filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);

    const matchesCategoryNav = !categoryMatch || categoryMatch.includes(p.category);
    const matchesPrice = p.price <= filters.maxPrice;
    const matchesFilterCategories = filters.categories.length === 0 || filters.categories.includes(p.category);
    const matchesStock = !filters.inStockOnly || p.stock > 0;

    return matchesSearch && matchesCategoryNav && matchesPrice && matchesFilterCategories && matchesStock;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const showBestSellers = selectedCategory === 'all' && !searchTerm && products.length > 0;

 return (
    <main className="product-grid-container">
      <BannerCarousel />
      <CategoryNav selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {showBestSellers && (
        <div className="best-sellers-section">
          <h2>🔥 {t('best_sellers')}</h2>
          <div className="product-grid">
            {products.slice(0, 4).map(p => (
              <ProductCard key={`bs-${p.id}`} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="shop-layout">
        <FilterSidebar filters={filters} onFilterChange={setFilters} products={products} />

        <div className="shop-main">
          <div className="shop-toolbar">
            <span className="results-count">{filteredProducts.length} {t('results')}</span>
            <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="no-results">{t('no_results')} "{searchTerm}"</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}
function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryMatch, setCategoryMatch] = useState(null);
 const theme = useSelector(state => state.theme.mode);

  const loadProducts = () => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message));
  };

  const handleSelectCategory = (key, match) => {
    setSelectedCategory(key);
    setCategoryMatch(match);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <BrowserRouter>
     <div className={`app ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="app">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} products={products} />
         <RouteTracker />
        <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
        <Routes>
          <Route path="/" element={
            <Home
              products={products}
              error={error}
              reloadProducts={loadProducts}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              categoryMatch={categoryMatch}
              onSelectCategory={handleSelectCategory}
            />
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
        <Footer />
        <SupportWidget />
      </div>
   </div>
    </BrowserRouter>
  );
}

export default App;