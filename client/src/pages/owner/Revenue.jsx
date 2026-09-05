import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR, formatDate } from '../../utils/format';

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

export default function Revenue() {
  const { logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings/owner');
      setBookings(data);
    } catch (err) {
      showToast(err.message, 'error');
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const revenueStatuses = ['active', 'approved', 'completed'];
  const totalRevenue = bookings
    .filter((b) => revenueStatuses.includes(b.status))
    .reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const activeCount = bookings.filter((b) => b.status === 'active').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const monthly = {};
  bookings
    .filter((b) => revenueStatuses.includes(b.status))
    .forEach((b) => {
      const d = b.createdAt ? new Date(b.createdAt) : new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      if (!monthly[key]) monthly[key] = { label, total: 0, count: 0 };
      monthly[key].total += Number(b.totalAmount) || 0;
      monthly[key].count += 1;
    });
  const monthlyList = Object.entries(monthly)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, v]) => v);

  const sorted = bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Revenue</h2>
          <p className="page-sub">Track earnings from your active and completed bookings.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">{formatINR(totalRevenue)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Bookings</div>
                  <div className="stat-value">{activeCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">{completedCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending</div>
                  <div className="stat-value">{pendingCount}</div>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Monthly Breakdown</h3>
                {monthlyList.length === 0 ? (
                  <p className="text-muted">No revenue data yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Bookings</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyList.map((m) => (
                          <tr key={m.label}>
                            <td><strong>{m.label}</strong></td>
                            <td>{m.count}</td>
                            <td>{formatINR(m.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">All Bookings</h3>
                {sorted.length === 0 ? (
                  <p className="text-muted">No bookings yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Warehouse</th>
                          <th>Space</th>
                          <th>Created</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((b) => (
                          <tr key={b._id}>
                            <td>{b.customerId?.name || 'Customer'}</td>
                            <td>{b.warehouseId?.name || '—'}</td>
                            <td>{b.space} sq.ft</td>
                            <td>{formatDate(b.createdAt)}</td>
                            <td>{formatINR(b.totalAmount)}</td>
                            <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
