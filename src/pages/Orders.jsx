import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getMyOrders, downloadInvoice, cancelOrder, requestReturn } from '../services/api';
import OrderTimeline from '../components/OrderTimeline';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { getProductById } from '../services/api';

function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { token } = useSelector(state => state.auth);
  const [actionOrderId, setActionOrderId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [reason, setReason] = useState('');
  const dispatch = useDispatch();
const navigate = useNavigate();

const handleReorder = async (order) => {
  try {
    const productPromises = order.items.map(item => getProductById(item.productId).catch(() => null));
    const results = await Promise.all(productPromises);

    let addedCount = 0;
    order.items.forEach((item, idx) => {
      const freshProduct = results[idx]?.data;
      if (freshProduct) {
        for (let i = 0; i < item.quantity; i++) {
          dispatch(addToCart(freshProduct));
        }
        addedCount++;
      }
    });

    if (addedCount === 0) {
      toast.error(t('reorder_failed'));
    } else if (addedCount < order.items.length) {
      toast(t('reorder_partial'), { icon: '⚠️' });
      navigate('/cart');
    } else {
      toast.success(t('reorder_added'));
      navigate('/cart');
    }
  } catch (err) {
    toast.error(t('reorder_failed'));
  }
};

  const openActionModal = (orderId, type) => {
    setActionOrderId(orderId);
    setActionType(type);
    setReason('');
  };

  const closeActionModal = () => {
    setActionOrderId(null);
    setActionType(null);
    setReason('');
  };

  const handleSubmitAction = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    try {
      if (actionType === 'cancel') {
        await cancelOrder(actionOrderId, reason);
        toast.success('Order cancelled');
      } else {
        await requestReturn(actionOrderId, reason);
        toast.success('Return request submitted');
      }
      closeActionModal();
      getMyOrders().then(res => setOrders(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  useEffect(() => {
    if (token) {
      getMyOrders()
        .then(res => setOrders(res.data))
        .catch(err => setError('Could not load orders'));
    }
  }, [token]);

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

<button className="reorder-btn" onClick={() => handleReorder(order)}>
  🔁 {t('reorder')}
</button>

{order.status === 'Pending' && (
  <button className="cancel-order-btn" onClick={() => openActionModal(order.id, 'cancel')}>
    Cancel Order
  </button>
)}
            {order.status === 'Pending' && (
              <button className="cancel-order-btn" onClick={() => openActionModal(order.id, 'cancel')}>
                Cancel Order
              </button>
            )}

            {order.status === 'Delivered' && (
              <button className="return-order-btn" onClick={() => openActionModal(order.id, 'return')}>
                Request Return
              </button>
            )}

            {order.cancellationReason && (
              <p className="order-reason">Cancelled: {order.cancellationReason}</p>
            )}
            {order.returnReason && (
              <p className="order-reason">Return reason: {order.returnReason}</p>
            )}
          </div>
        ))
      )}

      {actionOrderId && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{actionType === 'cancel' ? 'Cancel Order' : 'Request Return'}</h3>
            <textarea
              placeholder="Please provide a reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            <div className="modal-actions">
              <button onClick={handleSubmitAction} className="modal-confirm-btn">Submit</button>
              <button onClick={closeActionModal} className="modal-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;