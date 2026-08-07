import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const emptyForm = {
  name: '', description: '', price: '', imageUrl: '', additionalImageUrls: '', category: '', stock: ''
};

function AdminProducts() {
  const { role } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

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
  console.log("handleSubmit called", form);
  setError('');
  try {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };
    console.log("Payload being sent:", payload);

    if (editingId) {
      console.log("Updating product with id:", editingId);
      const res = await updateProduct(editingId, { ...payload, id: editingId });
      console.log("Update response:", res.data);
    } else {
      console.log("Creating new product");
      const res = await createProduct(payload);
      console.log("Create response:", res.data);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadProducts();
    console.log("Save successful, products reloaded");
  } catch (err) {
    console.log("SAVE FAILED:", err);
    console.log("Error response:", err.response);
    setError(err.response?.data?.message || 'Failed to save product');
  }
};

const handleEdit = (product) => {
  setForm({
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    additionalImageUrls: product.additionalImageUrls || '',
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
    <h2>{t('manage_products')}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? t('edit_product') : t('add_new_product')}</h3>
        {error && <p className="auth-error">{error}</p>}

        <input type="text" name="name" placeholder={t('product_name')} value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder={t('description')} value={form.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder={t('price')} value={form.price} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder={t('image_url')} value={form.imageUrl} onChange={handleChange} required />
       <input
  type="text"
  name="additionalImageUrls"
  placeholder="Additional image URLs (comma separated)"
  value={form.additionalImageUrls}
  onChange={handleChange}
/>
        <input type="text" name="category" placeholder={t('category')} value={form.category} onChange={handleChange} required />
        <input type="number" name="stock" placeholder={t('stock')} value={form.stock} onChange={handleChange} required />

        <div className="admin-form-actions">
    <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
    {editingId && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
  </div>
      </form>

      <h3>{t('all_products')}</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('image')}</th>
            <th>{t('name')}</th>
            <th>{t('category')}</th>
            <th>{t('price')}</th>
            <th>{t('stock')}</th>
            <th>{t('actions')}</th>
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
  <button className="action-btn" onClick={() => handleEdit(p)}>{t('edit')}</button>
  <button className="action-btn" onClick={() => handleDelete(p.id)}>{t('delete')}</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;