import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';


function Navbar({ searchTerm, onSearchChange }) {
    const { t, i18n } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const { token, fullName, role } = useSelector(state => state.auth);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('buyeasy_lang', lang);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">{t('appName')}</Link>

      <div className="navbar-search">
        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="search-btn">🔍</button>
      </div>

      <div className="navbar-actions">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className="lang-select"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        {token ? (
          <>
            <span className="nav-user">{t('hi')}, {fullName}</span>
            {role === 'Admin' && <Link to="/admin/products" className="nav-btn">{t('admin_products')}</Link>}
            {role === 'Admin' && <Link to="/admin/orders" className="nav-btn">{t('admin_orders')}</Link>}
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
      </div>
    </nav>
  );
}

export default Navbar;