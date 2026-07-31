import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductById } from '../services/api';
import { addToCart } from '../redux/cartSlice';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;
  if (!product) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Back to Products</Link>

      <div className="product-detail-container">
        <div className="product-detail-image">
          <img src={product.imageUrl || "https://via.placeholder.com/400"} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">₹{product.price}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          )}

          <button
            className="add-to-cart-btn detail-add-btn"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;