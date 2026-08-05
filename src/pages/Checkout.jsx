import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, createRazorpayOrder, verifyPayment } from '../services/api';
import { clearCart } from '../redux/cartSlice';
import { useTranslation } from 'react-i18next';
import { validateCoupon } from '../services/api';
import toast from 'react-hot-toast';


function Checkout() {
  const cartItems = useSelector(state => state.cart.items);
  const { token, fullName } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
const [couponApplied, setCouponApplied] = useState(null);
const [couponError, setCouponError] = useState('');


const handleApplyCoupon = async () => {
  setCouponError('');
  try {
    const res = await validateCoupon({ code: couponCode, orderAmount: total });
    setCouponApplied(res.data);
    toast.success(`${t('coupon_applied')}: -₹${res.data.discountAmount}`);
  } catch (err) {
    setCouponError(err.response?.data?.message || t('invalid_coupon'));
    setCouponApplied(null);
  }
};

const finalTotal = couponApplied ? couponApplied.finalAmount : total;
  const [form, setForm] = useState({
    customerName: fullName || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const { t } = useTranslation();
if (!token) {
  return (
    <div className="checkout-page">
      <p>{t('please_login_checkout')} <Link to="/login">{t('login')}</Link></p>
    </div>
  );
}


  if (cartItems.length === 0) {
    return (
    <div className="checkout-page">
      <p>{t('cart_empty')}. <Link to="/">{t('continue_shopping')}</Link></p>
    </div>
  );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Step 1: Create a Razorpay order
    const razorpayRes = await createRazorpayOrder(total);
    const { orderId, amount, currency, keyId } = razorpayRes.data;

    // Step 2: Open Razorpay checkout popup
    const options = {
      key: keyId,
      amount: amount * 100,
      currency: currency,
      name: "BuyEasy",
      description: "Order Payment",
      order_id: orderId,
      handler: async function (response) {
        try {
          // Step 3: Verify payment signature
          const verifyRes = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            // Step 4: Only NOW create the actual order in our database
            const orderData = {
              customerName: form.customerName,
              address: form.address,
              city: form.city,
              postalCode: form.postalCode,
              phone: form.phone,
              totalAmount: total,
              items: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
            };

       const orderRes = await createOrder(orderData);
dispatch(clearCart());
toast.success(t('toast_order_success'));
navigate(`/order-confirmation/${orderRes.data.id}`);
          } else {
            setError('Payment verification failed. Please try again.');
          }
        } catch (err) {
          setError('Payment verification failed.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: form.customerName,
        contact: form.phone,
      },
      theme: {
        color: "#fb641b",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    setError('Failed to initiate payment');
    setLoading(false);
  }
};

  return (
    <div className="checkout-page">
      <h2>{t('checkout')}</h2>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>{t('shipping_address')}</h3>
          {error && <p className="auth-error">{error}</p>}

          <input
            type="text"
            name="customerName"
           placeholder={t('full_name')}
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder={t('address')}
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
           placeholder={t('city')}
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder={t('postal_code')}
            value={form.postalCode}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
           placeholder={t('phone')}
            value={form.phone}
            onChange={handleChange}
            required
          />

        <button type="submit" disabled={loading}>
  {loading ? t('placing_order') : `${t('place_order')} (₹${total})`}
</button>
        </form>

        <div className="order-summary">
          <h3>{t('order_summary')}</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>{t('total')}: ₹{total}</strong>
          </div>
        </div>
        <div className="coupon-section">
  <input
    type="text"
    placeholder={t('enter_coupon')}
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
    disabled={!!couponApplied}
  />
  <button type="button" onClick={handleApplyCoupon} disabled={!!couponApplied || !couponCode}>
    {t('apply')}
  </button>
</div>
{couponError && <p className="auth-error">{couponError}</p>}
{couponApplied && (
  <p className="coupon-success">✓ {couponApplied.code} — {t('you_saved')} ₹{couponApplied.discountAmount}</p>
)}
      </div>
    </div>
  );
}

export default Checkout;