import { useTranslation } from 'react-i18next';

function StickyAddToCart({ price, onAddToCart, disabled }) {
  const { t } = useTranslation();

  return (
    <div className="sticky-add-to-cart">
      <div className="sticky-price">₹{price}</div>
      <button
        className="sticky-add-btn"
        onClick={onAddToCart}
        disabled={disabled}
      >
        {t('add_to_cart')}
      </button>
    </div>
  );
}

export default StickyAddToCart;