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

export default function Warehouses() {
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

  const toggleBlock = async (w) => {
    const newStatus = w.status === 'blocked' ? 'active' : 'blocked';
    try {
      await api.put(`/warehouses/${w._id}`, { status: newStatus });
      showToast(newStatus === 'blocked' ? 'Warehouse blocked' : 'Warehouse unblocked');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Manage Warehouses</h2>
          <p className="page-sub">View and moderate all warehouses on the platform.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : warehouses.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">🏗️</div>
              <p>No warehouses found.</p>
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
                    <th>Verification</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((w) => (
                    <tr key={w._id}>
                      <td><strong>{w.name}</strong></td>
                      <td>{w.ownerId?.name || '—'}</td>
                      <td>{w.location}</td>
                      <td>
                        {Number(w.availableSpace || 0).toLocaleString()} / {Number(w.totalSpace || 0).toLocaleString()} sq.ft
                      </td>
                      <td>{formatINR(w.price)}/sq.ft</td>
                      <td>
                        <span className={`status ${w.verificationStatus === 'verified' ? 'status-verified' : w.verificationStatus === 'pending' ? 'status-pending' : 'status-rejected'}`}>
                          {w.verificationStatus}
                        </span>
                      </td>
                      <td><span className={`status status-${w.status}`}>{w.status}</span></td>
                      <td>
                        <button
                          className={`btn ${w.status === 'blocked' ? 'btn-success' : 'btn-danger'} btn-sm`}
                          onClick={() => toggleBlock(w)}
                        >
                          {w.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
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
