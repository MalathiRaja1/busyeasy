import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getProductById, getProducts } from '../services/api';
import { addToCart } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setProduct(null); // reset while loading new product
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (product) {
      getProducts()
        .then(res => {
          const related = res.data.filter(
            p => p.category === product.category && p.id !== product.id
          );
          setRelatedProducts(related.slice(0, 4)); // show up to 4
        })
        .catch(() => {});
    }
  }, [product]);

const handleAddToCart = () => {
  for (let i = 0; i < quantity; i++) {
    dispatch(addToCart(product));
  }
  toast.success(`${product.name} ${t('toast_added_cart')}`);
};

  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;
  if (!product) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← {t('back_to_products')}</Link>

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
            {product.stock > 0 ? `${t('in_stock')} (${product.stock} ${t('available')})` : t('out_of_stock')}
          </p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>{t('quantity')}:</label>
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
            {t('add_to_cart')}
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>{t('related_products')}</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;