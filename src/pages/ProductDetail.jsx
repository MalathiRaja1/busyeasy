import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getProductById, getRecommendations, getProductVariants } from '../services/api';
import { addToCart } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import TrustBlock from '../components/TrustBlock';
import { addRecentlyViewed } from '../redux/recentlyViewedSlice';
import RecentlyViewed from '../components/RecentlyViewed';
import { Helmet } from 'react-helmet-async';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import StickyAddToCart from '../components/StickyAddToCart';
import { trackEvent } from '../utils/analytics';

function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const dispatch = useDispatch();
  const frequentlyBought = relatedProducts.slice(0, 2);

  useEffect(() => {
    setProduct(null);
    setVariants([]);
    setSelectedSize(null);
    setSelectedColor(null);
    getProductById(id)
      .then(res => {
        setProduct(res.data);
        dispatch(addRecentlyViewed(res.data));
      })
      .catch(err => setError(err.message));
  }, [id]);

useEffect(() => {
  if (product) {
    getRecommendations(product.id)
      .then(res => setRelatedProducts(res.data))
      .catch(() => {});

    getProductVariants(product.id)
      .then(res => setVariants(res.data))
      .catch(() => {});
  }
}, [product]);
  // useEffect(() => {
  //   if (product) {
  //     getProducts()
  //       .then(res => {
  //         const related = res.data.filter(
  //           p => p.category === product.category && p.id !== product.id
  //         );
  //         setRelatedProducts(related.slice(0, 4));
  //       })
  //       .catch(() => {});

  //     getProductVariants(product.id)
  //       .then(res => setVariants(res.data))
  //       .catch(() => {});
  //   }
  // }, [product]);

  const handleAddAllToCart = () => {
    dispatch(addToCart(product));
    frequentlyBought.forEach(p => dispatch(addToCart(p)));
    toast.success(t('bundle_added'));
  };

  const uniqueSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const hasVariants = variants.length > 0;

  const matchedVariant = variants.find(v =>
    (uniqueSizes.length === 0 || v.size === selectedSize) &&
    (uniqueColors.length === 0 || v.color === selectedColor)
  );

  const availableStock = hasVariants
    ? (matchedVariant ? matchedVariant.stock : 0)
    : product?.stock || 0;

  const canAddToCart = hasVariants
    ? (matchedVariant && matchedVariant.stock > 0 &&
       (uniqueSizes.length === 0 || selectedSize) &&
       (uniqueColors.length === 0 || selectedColor))
    : product?.stock > 0;

  const handleAddToCart = () => {
    if (hasVariants && !matchedVariant) {
      toast.error(t('select_variant_first'));
      return;
    }
const handleAddToCart = (e) => {
  e.preventDefault();
  dispatch(addToCart(product));
  trackEvent('add_to_cart', 'ecommerce', product.name, product.price);
  toast.success(`${product.name} ${t('toast_added_cart')}`);
};
    const cartItem = hasVariants
      ? {
          ...product,
          id: `${product.id}-${matchedVariant.id}`,
          productId: product.id,
          variantId: matchedVariant.id,
          size: matchedVariant.size,
          color: matchedVariant.color,
          stock: matchedVariant.stock,
        }
      : product;

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(cartItem));
    }
    toast.success(`${product.name} ${t('toast_added_cart')}`);
  };

  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;
  if (!product) return <ProductDetailSkeleton />;

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{product.name} - BuyEasy</title>
        <meta name="description" content={product.description} />
      </Helmet>

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

          {uniqueSizes.length > 0 && (
            <div className="variant-selector">
              <label>{t('size')}:</label>
              <div className="variant-options">
                {uniqueSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`variant-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {uniqueColors.length > 0 && (
            <div className="variant-selector">
              <label>{t('color')}:</label>
              <div className="variant-options">
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`variant-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className={availableStock > 0 ? "in-stock" : "out-of-stock"}>
  {hasVariants && !matchedVariant && t('select_variant_first')}
  {(!hasVariants || matchedVariant) && availableStock === 0 && t('out_of_stock')}
  {(!hasVariants || matchedVariant) && availableStock > 0 && availableStock <= 5 && (
    <span className="scarcity-text">⚡ {t('only_left', { count: availableStock })}</span>
  )}
  {(!hasVariants || matchedVariant) && availableStock > 5 && `${t('in_stock')} (${availableStock} ${t('available')})`}
</p>

          {canAddToCart && (
            <div className="quantity-selector">
              <label>{t('quantity')}:</label>
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => Math.min(availableStock, q + 1))}>+</button>
            </div>
          )}

          <button
            className="add-to-cart-btn detail-add-btn"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
          >
            {t('add_to_cart')}
          </button>

          <TrustBlock />
        </div>
      </div>

      {frequentlyBought.length > 0 && (
        <div className="fbt-section">
          <h2>{t('frequently_bought_together')}</h2>
          <div className="fbt-items">
            <img src={product.imageUrl} alt={product.name} className="fbt-thumb" />
            <span className="fbt-plus">+</span>
            {frequentlyBought.map((p, idx) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={p.imageUrl} alt={p.name} className="fbt-thumb" />
                {idx < frequentlyBought.length - 1 && <span className="fbt-plus">+</span>}
              </div>
            ))}
          </div>
          <p className="fbt-total">
            {t('total_price')}: ₹{product.price + frequentlyBought.reduce((sum, p) => sum + p.price, 0)}
          </p>
          <button className="add-to-cart-btn" onClick={handleAddAllToCart}>{t('add_all_to_cart')}</button>
        </div>
      )}

 {relatedProducts.length > 0 && (
  <div className="related-products-section">
    <h2>{t('customers_also_bought')}</h2>
    <div className="product-grid">
      {relatedProducts.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </div>
)}

      <ProductReviews productId={product.id} />
      <RecentlyViewed excludeId={product.id} />
            <StickyAddToCart
        price={product.price}
        onAddToCart={handleAddToCart}
        disabled={!canAddToCart}
      />
    </div>
  );
}

export default ProductDetail;