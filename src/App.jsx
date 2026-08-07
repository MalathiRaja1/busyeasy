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

import './App.css';

function Home({ products, error, reloadProducts, searchTerm, selectedCategory, categoryMatch, onSelectCategory }) {
  const location = useLocation();

  useEffect(() => {
    reloadProducts();
  }, [location.pathname]);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);

    const matchesCategory = !categoryMatch || categoryMatch.includes(p.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="product-grid-container">
      <CategoryNav selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {filteredProducts.length === 0 ? (
        <p className="no-results">{t('no_results')} "{searchTerm}"</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryMatch, setCategoryMatch] = useState(null);

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
      <div className="app">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;