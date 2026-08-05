import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCoupons, createCoupon, deleteCoupon } from '../services/api';

function AdminCoupons() {
  const { role } = useSelector(state => state.auth);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: '', discountType: 'Percentage', discountValue: '', minOrderAmount: '', expiryDate: '', usageLimit: ''
  });

  const loadCoupons = () => {
    getCoupons().then(res => setCoupons(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  if (role !== 'Admin') return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        ...form,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        expiryDate: form.expiryDate || null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
      });
      toast.success('Coupon created');
      setForm({ code: '', discountType: 'Percentage', discountValue: '', minOrderAmount: '', expiryDate: '', usageLimit: '' });
      loadCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    loadCoupons();
  };

  return (
    <div className="admin-page">
      <h2>Manage Coupons</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input placeholder="Coupon Code (e.g. SAVE10)" value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />

        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
          <option value="Percentage">Percentage (%)</option>
          <option value="Flat">Flat Amount (₹)</option>
        </select>

        <input type="number" placeholder="Discount Value" value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />

        <input type="number" placeholder="Min Order Amount (optional)" value={form.minOrderAmount}
          onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />

        <input type="date" placeholder="Expiry Date (optional)" value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />

        <input type="number" placeholder="Usage Limit (optional)" value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />

        <button type="submit">Create Coupon</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Expiry</th><th>Used</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(c => (
            <tr key={c.id}>
              <td><strong>{c.code}</strong></td>
              <td>{c.discountType}</td>
              <td>{c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
              <td>{c.minOrderAmount ? `₹${c.minOrderAmount}` : '-'}</td>
              <td>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No expiry'}</td>
              <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
              <td><button className="delete-btn" onClick={() => handleDelete(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCoupons;