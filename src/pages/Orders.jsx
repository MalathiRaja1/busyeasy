import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyOrders } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      getMyOrders()
        .then(res => setOrders(res.data))
        .catch(err => setError('Could not load orders'));
    }
  }, [token]);

  if (!token) {
    return <div className="orders-page"><p>Please <Link to="/login">login</Link> to view your orders.</p></div>;
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {error && <p className="auth-error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/">Start Shopping</Link></p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span className="order-status">{order.status}</span>
            </div>
            <p>{new Date(order.orderDate).toLocaleDateString()}</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span>{item.productName} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total: ₹{order.totalAmount}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;