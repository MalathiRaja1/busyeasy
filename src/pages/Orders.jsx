import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyOrders } from '../services/api';
import { useTranslation } from 'react-i18next';
import OrderTimeline from '../components/OrderTimeline';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { token } = useSelector(state => state.auth);
const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      getMyOrders()
        .then(res => setOrders(res.data))
        .catch(err => setError('Could not load orders'));
    }
  }, [token]);

if (!token) {
  return <div className="orders-page"><p>{t('please_login_orders')} <Link to="/login">{t('login')}</Link></p></div>;
}

  return (
    <div className="orders-page">
      <h2>{t('my_orders')}</h2>
      {error && <p className="auth-error">{error}</p>}
      {orders.length === 0 ? (
        <p>{t('no_orders_yet')} <Link to="/">{t('start_shopping')}</Link></p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
  <span>{t('order_id')} #{order.id}</span>
</div>
<OrderTimeline currentStatus={order.status} />
<p>{new Date(order.orderDate).toLocaleDateString()}</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span>{item.productName} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>{t('total')}: ₹{order.totalAmount}</strong>
            </div>
            <button className="invoice-btn" onClick={() => handleDownloadInvoice(order.id)}>📄 Download Invoice</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;