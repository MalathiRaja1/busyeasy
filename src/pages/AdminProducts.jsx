import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const emptyForm = {
  name: '', description: '', price: '', imageUrl: '', category: '', stock: ''
};

function AdminProducts() {
  const { role } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadProducts = () => {
    getProducts().then(res => setProducts(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };

      if (editingId) {
        await updateProduct(editingId, { ...payload, id: editingId });
      } else {
        await createProduct(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="admin-page">
      <h2>Manage Products</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        {error && <p className="auth-error">{error}</p>}

        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />

        <div className="admin-form-actions">
          <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
        </div>
      </form>

      <h3>All Products</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td><img src={p.imageUrl} alt={p.name} className="admin-table-img" /></td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;