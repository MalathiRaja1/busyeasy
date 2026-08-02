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

import './App.css';

function Home({ products, error, reloadProducts, searchTerm }) {
  const location = useLocation();
const { t } = useTranslation();

  useEffect(() => {
    reloadProducts();
  }, [location.pathname]);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <main className="product-grid-container">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {searchTerm && filteredProducts.length === 0 ? (
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

  const loadProducts = () => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Home products={products} error={error} reloadProducts={loadProducts} searchTerm={searchTerm} />} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;