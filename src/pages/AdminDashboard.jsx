import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';

function AdminDashboard() {
  const { role } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard stats'));
  }, []);

  if (role !== 'Admin') return <Navigate to="/" replace />;
  if (error) return <p className="auth-error" style={{ padding: '20px' }}>{error}</p>;
  if (!stats) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="admin-page">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{stats.totalOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Orders</span>
          <span className="stat-value pending">{stats.pendingOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Delivered Orders</span>
          <span className="stat-value delivered">{stats.deliveredOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{stats.totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{stats.totalCustomers}</span>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Top Selling Products</h3>
        {stats.topProducts.length === 0 ? (
          <p>No sales yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.productName}</td>
                  <td>{p.totalSold}</td>
                  <td>₹{p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>₹{o.totalAmount}</td>
                  <td><span className={`order-status status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;