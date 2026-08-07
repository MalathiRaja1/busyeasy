import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

function Cart() {
  const { t } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>{t('cart_empty')}</h2>
        <Link to="/" className="continue-shopping">{t('continue_shopping')}</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>{t('your_cart')}</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
              {(item.size || item.color) && (
    <p className="variant-tags">
      {item.size && <span>{t('size')}: {item.size}</span>}
      {item.size && item.color && ' | '}
      {item.color && <span>{t('color')}: {item.color}</span>}
    </p>
  )}
            <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
            <div className="cart-item-controls">
              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
<button className="remove-btn" onClick={() => {
  dispatch(removeFromCart(item.id));
  toast(t('toast_removed_cart'), { icon: '🗑️' });
}}>{t('remove')}</button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <h3>{t('total')}: ₹{total}</h3>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>{t('proceed_to_checkout')}</button>
<button className="clear-cart-btn" onClick={() => {
  dispatch(clearCart());
  toast(t('toast_cart_cleared'), { icon: '🧹' });
}}>{t('clear_cart')}</button>
      </div>
    </div>
  );
}

export default Cart;