import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { showToast } from '../../components/Toast';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

const emptyForm = { productName: '', category: '', quantity: '', lowStockThreshold: '', warehouseId: '' };

export default function Inventory() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState({ products: 0, quantity: 0, low: 0, expiring: 0, recent: 0 });

  const load = () => {
    Promise.all([api.get('/inventory/mine').catch(() => []), api.get('/bookings/mine').catch(() => [])])
      .then(([items, bookings]) => {
        setItems(items);
        const whs = bookings.filter((b) => b.status === 'active' || b.status === 'approved').map((b) => b.warehouseId);
        setWarehouses(whs);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    setSummary({
      products: items.length,
      quantity: items.reduce((s, i) => s + i.quantity, 0),
      low: items.filter((i) => i.lowStockThreshold && i.quantity <= i.lowStockThreshold).length,
      expiring: 0,
      recent: items.length,
    });
  }, [items]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, warehouseId: warehouses[0]?._id || '' }); setModal(true); };
  const openEdit = (it) => { setEditing(it); setForm({ productName: it.productName, category: it.category, quantity: it.quantity, lowStockThreshold: it.lowStockThreshold, warehouseId: it.warehouseId?._id || it.warehouseId }); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    const body = { ...form, quantity: Number(form.quantity), lowStockThreshold: Number(form.lowStockThreshold) || 0 };
    try {
      if (editing) {
        await api.put(`/inventory/${editing._id}`, body);
        showToast('Product updated');
      } else {
        await api.post('/inventory', body);
        showToast('Product added');
      }
      setModal(false); load();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const remove = async (it) => {
    if (!window.confirm(`Delete ${it.productName}?`)) return;
    try { await api.del(`/inventory/${it._id}`); showToast('Product deleted'); load(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const filtered = items.filter((i) => {
    const q = (i.productName + ' ' + (i.category || '')).toLowerCase();
    return q.includes(search.toLowerCase()) && (!category || i.category === category);
  });

  const stat = (l, v, sub) => <div className="stat-card"><div className="stat-label">{l}</div><div className="stat-value">{v}</div>{sub && <div className="stat-sub">{sub}</div>}</div>;

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <div className="flex-between">
            <div><h2 className="page-title">My Inventory</h2><p className="page-sub">Manage your stored products</p></div>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
          </div>

          <div className="stat-grid mt-2">
            {stat('Total Products', summary.products)}
            {stat('Total Quantity', summary.quantity)}
            {stat('Low Stock', summary.low, 'below threshold')}
          </div>

          <div className="card mt-3">
            <div className="flex-between mb-2" style={{ gap: 12 }}>
              <input className="form-group" style={{ maxWidth: 300, margin: 0 }} placeholder="Search product / SKU..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select style={{ maxWidth: 180, padding: '10px', border: '1.5px solid var(--border)', borderRadius: 8 }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {loading ? <p className="text-muted">Loading...</p> : filtered.length === 0 ? (
              <div className="empty"><div className="e-icon">📦</div><p>No products found. Add your first product to track it.</p></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Qty</th><th>Warehouse</th><th></th></tr></thead>
                  <tbody>
                    {filtered.map((i) => (
                      <tr key={i._id}>
                        <td className="fw-700">{i.productName}</td>
                        <td>{i.category || '—'}</td>
                        <td>{i.quantity} {i.lowStockThreshold && i.quantity <= i.lowStockThreshold ? <span className="tag tag-red">low</span> : null}</td>
                        <td>{i.warehouseId?.name || '—'}</td>
                        <td>
                          <div className="flex" style={{ gap: 6 }}>
                            <button className="btn btn-soft btn-sm" onClick={() => openEdit(i)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3">{editing ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={save}>
              <div className="form-group"><label>Product Name *</label><input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required /></div>
              <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Quantity *</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></div>
                <div className="form-group"><label>Low Stock Threshold</label><input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} /></div>
              </div>
              <div className="form-group">
                <label>Warehouse</label>
                <select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required>
                  <option value="">Select</option>
                  {warehouses.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                </select>
              </div>
              <div className="flex" style={{ gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
