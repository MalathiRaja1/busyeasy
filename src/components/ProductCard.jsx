import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigating when clicking the button
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
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>
          <button
            className="add-to-cart-btn"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;