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

export default function Bookings() {
  const { logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/bookings');
      setBookings(data);
    } catch (err) {
      showToast(err.message, 'error');
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markCompleted = async (b) => {
    try {
      await api.put(`/bookings/${b._id}/status`, { status: 'completed' });
      showToast('Booking marked completed');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const sorted = bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Manage Bookings</h2>
          <p className="page-sub">All booking requests across the platform.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">📋</div>
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Customer</th>
                    <th>Owner</th>
                    <th>Space</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((b) => (
                    <tr key={b._id}>
                      <td>{b.warehouseId?.name || '—'}</td>
                      <td>{b.customerId?.name || '—'}</td>
                      <td>{b.ownerId?.name || '—'}</td>
                      <td>{b.space} sq.ft</td>
                      <td>{formatDate(b.startDate)} — {formatDate(b.endDate)}</td>
                      <td>{formatINR(b.totalAmount)}</td>
                      <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'active' || b.status === 'approved' ? (
                          <button className="btn btn-soft btn-sm" onClick={() => markCompleted(b)}>Mark Completed</button>
                        ) : (
                          <span className="text-muted text-sm">—</span>
                        )}
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
