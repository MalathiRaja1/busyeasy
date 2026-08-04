import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist } from '../redux/wishlistSlice';
import toast from 'react-hot-toast';


function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const [justAdded, setJustAdded] = useState(false);

 const handleAddToCart = (e) => {
  e.preventDefault();
  dispatch(addToCart(product));
  toast.success(`${product.name} ${t('toast_added_cart')}`);
};

const handleWishlistToggle = (e) => {
  e.preventDefault();
  dispatch(toggleWishlist(product));
  toast(isWishlisted ? t('toast_removed_wishlist') : t('toast_added_wishlist'), {
    icon: isWishlisted ? '💔' : '❤️',
  });
};

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-wrapper">
          <img
            src={product.imageUrl || "https://via.placeholder.com/200"}
            alt={product.name}
            className="product-image"
          />
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label="Toggle wishlist"
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">₹{product.price}</p>
          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `${t('in_stock')} (${product.stock})` : t('out_of_stock')}
          </p>
          <button
            className={`add-to-cart-btn ${justAdded ? 'added' : ''}`}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {justAdded ? `✓ ${t('added')}` : t('add_to_cart')}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;