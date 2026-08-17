import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import NotificationBell from './NotificationBell';
import SearchAutocomplete from './SearchAutocomplete';
import { toggleTheme } from '../redux/themeSlice';


function Navbar({ searchTerm, onSearchChange, products }) {
  const { t, i18n } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const { token, fullName, role } = useSelector(state => state.auth);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(totalCount);
  const theme = useSelector(state => state.theme.mode);


  const handleLogout = () => {
    dispatch(logout());
    toast(t('toast_logout'), { icon: '👋' });
    navigate('/');
  };
const handleThemeToggle = () => {
  dispatch(toggleTheme());
};
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('buyeasy_lang', lang);
  };

  useEffect(() => {
    if (totalCount > prevCount.current) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 350);
      prevCount.current = totalCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = totalCount;
  }, [totalCount]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">{t('appName')}</Link>
 <SearchAutocomplete
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        products={products || []}
      />
     

      <div className="navbar-actions">
        <button className="theme-toggle-btn" onClick={handleThemeToggle} aria-label="Toggle dark mode">
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
        <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className="lang-select">
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        {token && <NotificationBell />}

        {token ? (
          <>
            <span className="nav-user">{t('hi')}, {fullName}</span>

            {role === 'Admin' && (
              <div className="admin-dropdown">
                <button className="nav-btn">Admin ▾</button>
                <div className="admin-dropdown-menu">
                  <Link to="/admin/dashboard">Dashboard</Link>
                  <Link to="/admin/products">Products</Link>
                  <Link to="/admin/orders">Orders</Link>
                  <Link to="/admin/coupons">Coupons</Link>
                </div>
              </div>
            )}

            <button className="nav-btn" onClick={handleLogout}>{t('logout')}</button>
          </>
        ) : (
          <Link to="/login" className="nav-btn">{t('login')}</Link>
        )}

        <Link to="/cart" className="nav-btn cart-btn">
          🛒 {t('cart')}
          <span className="cart-count">{totalCount}</span>
        </Link>
        <Link to="/orders" className="nav-btn">{t('my_orders')}</Link>
        <Link to="/wishlist" className="nav-btn cart-btn">
          ❤️ {t('wishlist')}
          <span className="cart-count">{wishlistItems.length}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;