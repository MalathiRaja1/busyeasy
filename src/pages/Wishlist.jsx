import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';

function Wishlist() {
  const { t } = useTranslation();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const dispatch = useDispatch();

  if (wishlistItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>{t('wishlist_empty')}</h2>
        <Link to="/" className="continue-shopping">{t('continue_shopping')}</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>{t('my_wishlist')}</h2>
      {wishlistItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <div className="cart-item-controls">
              <button onClick={() => dispatch(addToCart(item))}>{t('add_to_cart')}</button>
              <button className="remove-btn" onClick={() => dispatch(removeFromWishlist(item.id))}>{t('remove')}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;