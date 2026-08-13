import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrderById, downloadInvoice } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';

function OrderConfirmation() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderById(id)
      .then(res => setOrder(res.data))
      .catch(err => setError('Could not load order details'));
  }, [id]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download invoice', err);
    }
  };

  if (error) return <p className="auth-error" style={{ padding: '20px' }}>{error}</p>;
  if (!order) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="confirmation-page">
      <div className="confirmation-box">
        <h2>✅ {t('order_placed')}</h2>
        <p>{t('order_id')}: #{order.id}</p>
        <OrderTimeline currentStatus={order.status} />
<p>{t('payment_method')}: {order.paymentMethod === 'COD' ? `💵 ${t('cash_on_delivery')}` : `💳 ${t('pay_online')}`}</p>
{order.paymentMethod === 'COD' && order.paymentStatus === 'Pending' && (
  <p className="cod-notice">{t('cod_notice')}</p>
)}
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
          <button className="nav-btn" onClick={() => handleDownloadInvoice(order.id)}>📄 Download Invoice</button>
          <Link to="/" className="nav-btn">{t('continue_shopping')}</Link>
          <Link to="/orders" className="nav-btn">{t('view_my_orders')}</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;