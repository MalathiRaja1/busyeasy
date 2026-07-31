import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';

function Navbar({ searchTerm, onSearchChange }) {
  const cartItems = useSelector(state => state.cart.items);
  const { token, fullName, role } = useSelector(state => state.auth);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">BuyEasy</Link>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search for products, brands and more"
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="search-btn">🔍</button>
      </div>

      <div className="navbar-actions">
        {token ? (
          <>
            <span className="nav-user">Hi, {fullName}</span>
            {role === 'Admin' && (
  <>
    <Link to="/admin/products" className="nav-btn">Admin Products</Link>
    <Link to="/admin/orders" className="nav-btn">Admin Orders</Link>
  </>
)}
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-btn">Login</Link>
        )}
        <Link to="/cart" className="nav-btn cart-btn">
          🛒 Cart
          <span className="cart-count">{totalCount}</span>
        </Link>
        <Link to="/orders" className="nav-btn">My Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;