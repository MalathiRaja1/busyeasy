import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

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
        <h2>✅ Order Placed Successfully!</h2>
        <p>Order ID: #{order.id}</p>
        <p>Status: {order.status}</p>

        <h3>Shipping To:</h3>
        <p>{order.customerName}</p>
        <p>{order.address}, {order.city} - {order.postalCode}</p>
        <p>Phone: {order.phone}</p>

        <h3>Items:</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="summary-item">
            <span>{item.productName} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="summary-total">
          <strong>Total: ₹{order.totalAmount}</strong>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="nav-btn">Continue Shopping</Link>
          <Link to="/orders" className="nav-btn">View My Orders</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;