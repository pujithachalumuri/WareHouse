import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';

const OWNER_SECTIONS = [
  { to: '/owner-dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/my-warehouses', label: 'My Warehouses', icon: '🏗️' },
  { to: '/add-warehouse', label: 'Add Warehouse', icon: '➕' },
  { to: '/booking-requests', label: 'Booking Requests', icon: '📋' },
  { to: '/owner-customers', label: 'Customers', icon: '👥' },
  { to: '/revenue', label: 'Revenue', icon: '💰' },
  { to: '/owner-agreements', label: 'Agreements', icon: '📝' },
  { to: '/owner-profile', label: 'Profile', icon: '👤' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
];

const facilitiesList = ['CCTV', 'Parking', 'Loading/Unloading', 'Electricity', '24/7 Access', 'Climate Control', 'Refrigeration', 'Shelving Racks'];
const securityList = ['24/7 Security Guard', 'CCTV Surveillance', 'Biometric Access', 'Fire Safety', 'Perimeter Fencing', 'Alarm System', 'Access Control'];
const storageTypes = ['Dry Storage', 'Cold Storage', 'Secure Vault', 'Open Yard', 'Controlled'];
const warehouseTypes = ['Partial', 'Full', 'Shared', 'Multi-tenant'];

const emptyForm = {
  name: '', location: '', address: '', totalSpace: 0, availableSpace: 0,
  price: 0, minimumDuration: 1, storageType: 'Dry Storage', warehouseType: 'Partial',
  description: '', facilities: [], security: [], images: [],
};

export default function EditWarehouse() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/warehouses/${id}`);
      const w = data.warehouse || data;
      setForm({
        name: w.name || '', location: w.location || '', address: w.address || '',
        totalSpace: w.totalSpace || 0, availableSpace: w.availableSpace || 0,
        price: w.price || 0, minimumDuration: w.minimumDuration || 1,
        storageType: w.storageType || 'Dry Storage', warehouseType: w.warehouseType || 'Partial',
        description: w.description || '', facilities: w.facilities || [],
        security: w.security || [], images: w.images || [],
      });
    } catch (err) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const toggle = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.availableSpace) > Number(form.totalSpace)) {
      showToast('Available space cannot exceed total space', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/warehouses/${id}`, {
        ...form,
        totalSpace: Number(form.totalSpace),
        availableSpace: Number(form.availableSpace),
        price: Number(form.price),
        minimumDuration: Number(form.minimumDuration) || 1,
      });
      showToast('Warehouse updated successfully');
      navigate('/my-warehouses');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Edit Warehouse</h2>
          <p className="page-sub">Update the details of your warehouse listing.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <form onSubmit={submit} className="card">
              <div className="form-row">
                <div className="form-group">
                  <label>Warehouse Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Warehouse A - Bhiwandi Hub" />
                </div>
                <div className="form-group">
                  <label>Location / City *</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="e.g. Bhiwandi, Maharashtra" />
                </div>
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Plot, area, landmark" />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Total Area (sq.ft) *</label>
                  <input type="number" value={form.totalSpace} onChange={(e) => setForm({ ...form, totalSpace: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Available Area (sq.ft) *</label>
                  <input type="number" value={form.availableSpace} onChange={(e) => setForm({ ...form, availableSpace: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Price (₹/sq.ft/month) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Storage Type</label>
                  <select value={form.storageType} onChange={(e) => setForm({ ...form, storageType: e.target.value })}>
                    {storageTypes.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Rental Type</label>
                  <select value={form.warehouseType} onChange={(e) => setForm({ ...form, warehouseType: e.target.value })}>
                    {warehouseTypes.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Minimum Rental Duration (months)</label>
                  <input type="number" min={1} value={form.minimumDuration} onChange={(e) => setForm({ ...form, minimumDuration: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your warehouse..." />
              </div>

              <h3 className="mb-2 mt-3">Facilities</h3>
              <div className="checkbox-grid mb-3">
                {facilitiesList.map((f) => (
                  <label className="checkbox-item" key={f}>
                    <input type="checkbox" checked={form.facilities.includes(f)} onChange={() => toggle('facilities', f)} /> {f}
                  </label>
                ))}
              </div>

              <h3 className="mb-2">Security Features</h3>
              <div className="checkbox-grid mb-3">
                {securityList.map((f) => (
                  <label className="checkbox-item" key={f}>
                    <input type="checkbox" checked={form.security.includes(f)} onChange={() => toggle('security', f)} /> {f}
                  </label>
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Warehouse'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
