import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR, formatDate } from '../../utils/format';

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

export default function Payments() {
  const { logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/payments');
      setPayments(data);
    } catch (err) {
      showToast(err.message, 'error');
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sorted = payments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Manage Payments</h2>
          <p className="page-sub">All payments processed on the platform.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">💳</div>
              <p>No payments found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Warehouse</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p) => (
                    <tr key={p._id}>
                      <td>{p.customerId?.name || '—'}</td>
                      <td>{p.warehouseId?.name || '—'}</td>
                      <td>{formatINR(p.amount)}</td>
                      <td><span className="tag">{p.type || '—'}</span></td>
                      <td>{p.method || '—'}</td>
                      <td><span className={`status status-${p.status}`}>{p.status}</span></td>
                      <td>{formatDate(p.createdAt)}</td>
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
