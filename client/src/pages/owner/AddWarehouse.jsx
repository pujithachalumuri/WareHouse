import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const MAX_VIDEO_MB = 2.5;
const MAX_DOC_MB = 2;
const MAX_DOCS = 3;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Could not read file'));
    r.readAsDataURL(file);
  });

const stripPrefix = (dataUrl) => {
  const m = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl || '');
  return m ? { mime: m[1], data: m[2] } : { mime: '', data: dataUrl || '' };
};

export default function AddWarehouse() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', location: '', address: '', totalSpace: '', availableSpace: '',
    price: '', minimumDuration: 1, storageType: 'Dry Storage', warehouseType: 'Partial',
    description: '', facilities: [], security: [], images: [],
    verificationVideo: '', verificationVideoName: '', verificationDocuments: [],
  });

  const toggle = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
  };

  const onVideo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      showToast(`Video must be under ${MAX_VIDEO_MB}MB`, 'error');
      return;
    }
    try {
      const { data } = stripPrefix(await fileToBase64(file));
      setForm((f) => ({ ...f, verificationVideo: data, verificationVideoName: file.name }));
    } catch (err) { showToast(err.message, 'error'); }
  };

  const onDocs = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const current = form.verificationDocuments;
    const room = MAX_DOCS - current.length;
    if (files.length > room) {
      showToast(`Maximum ${MAX_DOCS} documents allowed`, 'error');
    }
    const accepted = files.slice(0, Math.max(0, room));
    const out = [];
    for (const file of accepted) {
      if (file.size > MAX_DOC_MB * 1024 * 1024) {
        showToast(`"${file.name}" exceeds the ${MAX_DOC_MB}MB limit`, 'error');
        continue;
      }
      try {
        const { mime, data } = stripPrefix(await fileToBase64(file));
        out.push({ name: file.name, type: mime || file.type, data });
      } catch (err) { showToast(err.message, 'error'); }
    }
    setForm((f) => ({ ...f, verificationDocuments: [...f.verificationDocuments, ...out] }));
  };

  const removeDoc = (i) => {
    setForm((f) => ({ ...f, verificationDocuments: f.verificationDocuments.filter((_, x) => x !== i) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.availableSpace) > Number(form.totalSpace)) {
      showToast('Available space cannot exceed total space', 'error');
      return;
    }
    if (!form.verificationVideo && form.verificationDocuments.length === 0) {
      showToast('Upload a warehouse video or documents as proof before submitting', 'error');
      return;
    }
    const approxBytes = (b64) => Math.floor(String(b64 || '').length * 3 / 4);
    const totalUpload = approxBytes(form.verificationVideo) + form.verificationDocuments.reduce((s, d) => s + approxBytes(d.data), 0);
    if (totalUpload > 3.4 * 1024 * 1024) {
      showToast('Total upload size exceeds 3.4MB. Use a shorter video or smaller documents.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/warehouses', {
        ...form,
        verificationVideoName: undefined,
        totalSpace: Number(form.totalSpace),
        availableSpace: Number(form.availableSpace),
        price: Number(form.price),
        minimumDuration: Number(form.minimumDuration) || 1,
      });
      showToast('Warehouse submitted for admin verification');
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
          <h2 className="page-title">Add Warehouse</h2>
          <p className="page-sub">List your warehouse space. Upload proof (video/documents) — an admin approves it before it goes live.</p>

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
                <input type="number" value={form.totalSpace} onChange={(e) => setForm({ ...form, totalSpace: e.target.value })} required placeholder="e.g. 10000" />
              </div>
              <div className="form-group">
                <label>Available Area (sq.ft) *</label>
                <input type="number" value={form.availableSpace} onChange={(e) => setForm({ ...form, availableSpace: e.target.value })} required placeholder="e.g. 3000" />
                <div className="form-hint">The unused portion you want to list.</div>
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

            <h3 className="mb-2 mt-3">Verification Proof *</h3>
            <p className="text-muted text-sm mb-2" style={{ marginTop: -8 }}>
              Upload a short video of the warehouse and/or documents (ownership, licence, lease) so the admin can verify it exists.
            </p>
            <div className="form-group">
              <label>Warehouse Video (max {MAX_VIDEO_MB}MB)</label>
              <input type="file" accept="video/*" onChange={onVideo} />
              {form.verificationVideoName && <div className="form-hint">🎬 {form.verificationVideoName} — uploaded</div>}
            </div>
            <div className="form-group">
              <label>Documents (PDF/images, max {MAX_DOC_MB}MB each, up to {MAX_DOCS})</label>
              <input type="file" accept=".pdf,image/*" multiple onChange={onDocs} />
              <div className="flex" style={{ gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {form.verificationDocuments.map((d, i) => (
                  <span key={i} className="tag tag-blue">
                    📄 {d.name} <button type="button" className="btn-link" onClick={() => removeDoc(i)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Warehouse For Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
