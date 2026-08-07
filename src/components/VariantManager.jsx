import { useEffect, useState } from 'react';
import { getProductVariants, createVariant, deleteVariant } from '../services/api';

function VariantManager({ productId,onVariantChange  }) {
  const [variants, setVariants] = useState([]);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStock] = useState('');


  const loadVariants = () => {
    getProductVariants(productId).then(res => setVariants(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadVariants();
  }, [productId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!size && !color) return;
    await createVariant({ productId, size, color, stock: parseInt(stock) || 0 });
    setSize('');
    setColor('');
    setStock('');
    loadVariants();
    if (onVariantChange) onVariantChange();
  };

  const handleDelete = async (id) => {
    await deleteVariant(id);
    loadVariants();
    if (onVariantChange) onVariantChange();
  };

  return (
    <div className="variant-manager">
      <h4>Variants</h4>
      <form onSubmit={handleAdd} className="variant-manager-form">
        <input placeholder="Size (e.g. M)" value={size} onChange={(e) => setSize(e.target.value)} />
        <input placeholder="Color (e.g. Red)" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <button type="submit">Add Variant</button>
      </form>

      {variants.length > 0 && (
        <table className="variant-table">
          <thead>
            <tr><th>Size</th><th>Color</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.id}>
                <td>{v.size || '-'}</td>
                <td>{v.color || '-'}</td>
                <td>{v.stock}</td>
                <td><button type="button" className="delete-btn" onClick={() => handleDelete(v.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VariantManager;