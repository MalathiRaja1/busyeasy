import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  saveForLater,
  moveToCart,
  removeFromSaved,
} from '../redux/cartSlice';

function Cart() {
  const { t } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const savedItems = useSelector(state => state.cart.savedForLater);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0 && savedItems.length === 0) {
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

      {cartItems.length === 0 ? (
        <p>{t('cart_empty')}</p>
      ) : (
        cartItems.map(item => (
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
                <button
                  className="save-later-btn"
                  onClick={() => {
                    dispatch(saveForLater(item.id));
                    toast('Saved for later', { icon: '🔖' });
                  }}
                >
                  {t('save_for_later')}
                </button>
                <button className="remove-btn" onClick={() => {
                  dispatch(removeFromCart(item.id));
                  toast(t('toast_removed_cart'), { icon: '🗑️' });
                }}>{t('remove')}</button>
              </div>
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>{t('total')}: ₹{total}</h3>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>{t('proceed_to_checkout')}</button>
          <button className="clear-cart-btn" onClick={() => {
            dispatch(clearCart());
            toast(t('toast_cart_cleared'), { icon: '🧹' });
          }}>{t('clear_cart')}</button>
        </div>
      )}

      {savedItems.length > 0 && (
        <div className="saved-for-later-section">
          <h3>{t('saved_for_later')} ({savedItems.length})</h3>
          {savedItems.map(item => (
            <div key={item.id} className="cart-item saved-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <div className="cart-item-controls">
                  <button
                    className="move-to-cart-btn"
                    onClick={() => {
                      dispatch(moveToCart(item.id));
                      toast.success(t('moved_to_cart'));
                    }}
                  >
                    {t('move_to_cart')}
                  </button>
                  <button className="remove-btn" onClick={() => dispatch(removeFromSaved(item.id))}>{t('remove')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;