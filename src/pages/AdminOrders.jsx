import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../services/api';
import { useTranslation } from 'react-i18next';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

function AdminOrders() {
  const { role } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const loadOrders = () => {
    getAllOrders().then(res => setOrders(res.data)).catch(() => setError('Failed to load orders'));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <div className="admin-page">
      <h2>{t('all_orders')}</h2>
      {error && <p className="auth-error">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id} — {order.customerName}</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="status-select"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <p>{new Date(order.orderDate).toLocaleDateString()} — {order.address}, {order.city} - {order.postalCode}</p>
            <p>Phone: {order.phone}</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span>{item.productName} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>{t('total')}: ₹{order.totalAmount}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;