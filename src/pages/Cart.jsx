import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
            <div className="cart-item-controls">
              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
              <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: ₹{total}</h3>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>
      </div>
    </div>
  );
}

export default Cart;