import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR } from '../../utils/format';

const ADMIN_SECTIONS = [
  { to: '/admin-dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/verification', label: 'Verification', icon: '✅' },
  { to: '/manage-warehouses', label: 'Warehouses', icon: '🏗️' },
  { to: '/manage-bookings', label: 'Bookings', icon: '📋' },
  { to: '/manage-payments', label: 'Payments', icon: '💳' },
  { to: '/complaints', label: 'Complaints', icon: '⚠️' },
  { to: '/reviews', label: 'Reviews', icon: '⭐' },
  { to: '/reports', label: 'Reports', icon: '📈' },
];

export default function Verification() {
  const { logout } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/warehouses');
      setWarehouses(data);
    } catch (err) {
      showToast(err.message, 'error');
      setWarehouses([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const pending = warehouses.filter((w) => w.verificationStatus === 'pending');

  const verify = async (w, status) => {
    try {
      await api.put(`/warehouses/${w._id}/verify`, { verificationStatus: status });
      showToast(status === 'verified' ? 'Warehouse verified' : 'Warehouse rejected');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const sections = ADMIN_SECTIONS.map((s) =>
    s.to === '/verification' ? { ...s, count: pending.length } : s
  );

  return (
    <div className="dashboard">
      <Sidebar sections={sections} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Warehouse Verification</h2>
          <p className="page-sub">
            Review and verify warehouses awaiting approval. ({pending.length} pending)
          </p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : pending.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">✅</div>
              <p>No warehouses pending verification.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Space</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((w) => (
                    <tr key={w._id}>
                      <td><strong>{w.name}</strong></td>
                      <td>{w.ownerId?.name || '—'}</td>
                      <td>{w.location}</td>
                      <td>
                        {Number(w.availableSpace || 0).toLocaleString()} / {Number(w.totalSpace || 0).toLocaleString()} sq.ft
                      </td>
                      <td>{formatINR(w.price)}/sq.ft</td>
                      <td><span className="status status-pending-verify">pending</span></td>
                      <td>
                        <div className="flex" style={{ gap: 8 }}>
                          <button className="btn btn-success btn-sm" onClick={() => verify(w, 'verified')}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => verify(w, 'rejected')}>Reject</button>
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
  );
}
