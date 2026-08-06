import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  validateCoupon,
  getMyAddresses,
  createAddress,
} from '../services/api';
import { clearCart } from '../redux/cartSlice';

function Checkout() {
  const { t } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const { token, fullName } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: fullName || '',
     email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = couponApplied ? couponApplied.finalAmount : total;

  useEffect(() => {
    if (token) {
      getMyAddresses().then(res => {
        setSavedAddresses(res.data);
        const defaultAddr = res.data.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setForm({
            customerName: defaultAddr.fullName,
            address: defaultAddr.addressLine,
            city: defaultAddr.city,
            postalCode: defaultAddr.postalCode,
            phone: defaultAddr.phone,
          });
        }
      }).catch(() => {});
      {!token && (
  <p className="guest-checkout-hint">
    {t('guest_checkout_hint')} <Link to="/signup">{t('sign_up')}</Link>
  </p>
)}
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setForm({
      customerName: addr.fullName,
      address: addr.addressLine,
      city: addr.city,
      postalCode: addr.postalCode,
      phone: addr.phone,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const razorpayRes = await createRazorpayOrder(finalTotal);
      const { orderId, amount, currency, keyId } = razorpayRes.data;

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: currency,
        name: "BuyEasy",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              const orderData = {
                customerName: form.customerName,
                email: form.email,
                address: form.address,
                city: form.city,
                postalCode: form.postalCode,
                phone: form.phone,
                totalAmount: finalTotal,
                couponCode: couponApplied?.code || null,
                items: cartItems.map(item => ({
                  productId: item.id,
                  productName: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
              };

              if (saveNewAddress && !selectedAddressId) {
                createAddress({
                  label: 'Home',
                  fullName: form.customerName,
                  addressLine: form.address,
                  city: form.city,
                  postalCode: form.postalCode,
                  phone: form.phone,
                  isDefault: savedAddresses.length === 0,
                }).catch(() => {});
              }

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

  // if (!token) {
  //   return (
  //     <div className="checkout-page">
  //       <p>{t('please_login_checkout')} <Link to="/login">{t('login')}</Link></p>
  //     </div>
  //   );
  // }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <p>{t('cart_empty')}. <Link to="/">{t('continue_shopping')}</Link></p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>{t('checkout')}</h2>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>{t('shipping_address')}</h3>
          {error && <p className="auth-error">{error}</p>}

          {token && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <h4>{t('saved_addresses')}</h4>
              {savedAddresses.map(addr => (
                <div
                  key={addr.id}
                  className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <strong>{addr.label}</strong>{' '}
                  {addr.isDefault && <span className="default-tag">{t('default')}</span>}
                  <p>{addr.fullName}, {addr.addressLine}, {addr.city} - {addr.postalCode}</p>
                </div>
              ))}
              <p
                className="new-address-link"
                onClick={() => {
                  setSelectedAddressId(null);
                  setForm({ customerName: '', address: '', city: '', postalCode: '', phone: '' });
                }}
              >
                + {t('use_new_address')}
              </p>
            </div>
          )}

          <input
            type="text"
            name="customerName"
            placeholder={t('full_name')}
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <input
  type="email"
  name="email"
  placeholder={t('email')}
  value={form.email}
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

          {!selectedAddressId && (
            <label className="save-address-check">
              <input
                type="checkbox"
                checked={saveNewAddress}
                onChange={(e) => setSaveNewAddress(e.target.checked)}
              />
              {t('save_this_address')}
            </label>
          )}

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
            <p className="coupon-success">
              ✓ {couponApplied.code} — {t('you_saved')} ₹{couponApplied.discountAmount}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? t('placing_order') : `${t('place_order')} (₹${finalTotal})`}
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
            <strong>{t('total')}: ₹{finalTotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;