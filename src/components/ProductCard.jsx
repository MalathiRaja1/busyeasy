import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../redux/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <img
          src={product.imageUrl || "https://via.placeholder.com/200"}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">₹{product.price}</p>
          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `${t('in_stock')} (${product.stock})` : t('out_of_stock')}
          </p>
          <button
            className="add-to-cart-btn"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {t('add_to_cart')}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;