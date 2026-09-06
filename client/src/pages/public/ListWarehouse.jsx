import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';

const facilitiesList = ['CCTV', 'Parking', 'Loading/Unloading', 'Electricity', '24/7 Access', 'Climate Control', 'Refrigeration', 'Shelving Racks'];
const securityList = ['24/7 Security Guard', 'CCTV Surveillance', 'Biometric Access', 'Fire Safety', 'Perimeter Fencing', 'Alarm System', 'Access Control'];

export default function ListWarehouse() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', location: '', address: '', totalSpace: '', availableSpace: '',
    price: '', minimumDuration: 1, storageType: 'Dry Storage', warehouseType: 'Partial',
    description: '', facilities: [], security: [], images: [],
  });

  const toggle = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'owner') {
      showToast('Please register as a warehouse owner first', 'error');
      return;
    }
    if (Number(form.availableSpace) > Number(form.totalSpace)) {
      showToast('Available space cannot exceed total space', 'error');
      return;
    }
    try {
      await api.post('/warehouses', { ...form, totalSpace: Number(form.totalSpace), availableSpace: Number(form.availableSpace), price: Number(form.price) });
      setSubmitted(true);
      showToast('Warehouse created successfully');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (submitted) {
    return (
      <div className="section">
        <div className="container-narrow">
          <div className="card text-center" style={{ padding: '48px 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 className="mb-2">Warehouse created successfully</h2>
            <p className="text-muted mb-3">Your warehouse is now live on the platform.</p>
            <Link to="/owner-dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: 40 }}>
      <div className="container-narrow">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <span className="eyebrow">List Your Space</span>
          <h2 style={{ fontSize: '1.8rem' }}>Turn Unused Warehouse Space Into Income</h2>
          <p>List the available portion of your warehouse and start earning from space you aren't using.</p>
        </div>
        {!user || user.role !== 'owner' ? (
          <div className="card text-center" style={{ padding: '40px' }}>
            <h3 className="mb-2">Register as a Warehouse Owner</h3>
            <p className="text-muted mb-3">You need an owner account to list warehouse space.</p>
            <div className="flex" style={{ gap: 10, justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary">Create Owner Account</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="card">
            <h3 className="mb-3">Warehouse Details</h3>
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
                <input type="number" value={form.totalSpace} onChange={(e) => setForm({ ...form, totalSpace: e.target.value })} required placeholder="e.g. 10000" />
              </div>
              <div className="form-group">
                <label>Available Area (sq.ft) *</label>
                <input type="number" value={form.availableSpace} onChange={(e) => setForm({ ...form, availableSpace: e.target.value })} required placeholder="e.g. 3000" />
                <div className="form-hint">The unused portion you want to list. e.g. if total is 10,000 sq.ft and 7,000 is used, list 3,000.</div>
              </div>
              <div className="form-group">
                <label>Price (₹/sq.ft/month) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="e.g. 20" />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Storage Type</label>
                <select value={form.storageType} onChange={(e) => setForm({ ...form, storageType: e.target.value })}>
                  {['Dry Storage', 'Cold Storage', 'Secure Vault', 'Open Yard', 'Controlled'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Rental Type</label>
                <select value={form.warehouseType} onChange={(e) => setForm({ ...form, warehouseType: e.target.value })}>
                  {['Partial', 'Full', 'Shared', 'Multi-tenant'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Minimum Rental Duration (months)</label>
                <input type="number" min={1} value={form.minimumDuration} onChange={(e) => setForm({ ...form, minimumDuration: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your warehouse, capacity, and ideal tenants..." />
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

            <button className="btn btn-primary btn-lg btn-block">Submit Warehouse For Verification</button>
          </form>
        )}
      </div>
    </div>
  );
}
