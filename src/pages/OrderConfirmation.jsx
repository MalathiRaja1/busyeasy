import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';
import { useTranslation } from 'react-i18next';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
const { t } = useTranslation();

  useEffect(() => {
    getOrderById(id)
      .then(res => setOrder(res.data))
      .catch(err => setError('Could not load order details'));
  }, [id]);

  if (error) return <p className="auth-error" style={{ padding: '20px' }}>{error}</p>;
  if (!order) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="confirmation-page">
      <div className="confirmation-box">
       <h2>✅ {t('order_placed')}</h2>
       <p>{t('order_id')}: #{order.id}</p>
       <p>{t('status')}: {order.status}</p>

        <h3>{t('shipping_to')}:</h3>
        <p>{order.customerName}</p>
        <p>{order.address}, {order.city} - {order.postalCode}</p>
        <p>Phone: {order.phone}</p>

      <h3>{t('items')}:</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="summary-item">
            <span>{item.productName} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="summary-total">
         <strong>{t('total')}: ₹{order.totalAmount}</strong>
        </div>

        <div className="confirmation-actions">
        <Link to="/" className="nav-btn">{t('continue_shopping')}</Link>
         <Link to="/orders" className="nav-btn">{t('view_my_orders')}</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;