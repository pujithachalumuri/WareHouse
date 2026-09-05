import { useEffect, useState } from 'react';
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

export default function Customers() {
  const { logout } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings/owner');
      const map = new Map();
      data.forEach((b) => {
        const c = b.customerId;
        if (!c) return;
        const key = c._id || c.email || c.phone || c.name;
        if (!key) return;
        if (!map.has(key)) map.set(key, { ...c, bookings: [], active: 0 });
        const entry = map.get(key);
        entry.bookings.push(b);
        if (b.status === 'active') entry.active += 1;
      });
      const list = Array.from(map.values()).map((c) => ({
        ...c,
        totalBookings: c.bookings.length,
        activeBookings: c.active,
      }));
      setCustomers(list);
    } catch (err) {
      showToast(err.message, 'error');
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Customers</h2>
          <p className="page-sub">People who have booked space in your warehouses.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : customers.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">👥</div>
              <p>No customers yet. You'll see them here once bookings are made.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Company</th>
                    <th>Phone</th>
                    <th>Total Bookings</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id || c.name}>
                      <td>
                        <span className="avatar">{c.name?.[0]}</span>
                        <strong>{c.name || 'Unknown'}</strong>
                      </td>
                      <td>{c.company || '—'}</td>
                      <td>{c.phone || '—'}</td>
                      <td><span className="tag tag-blue">{c.totalBookings}</span></td>
                      <td><span className="tag tag-green">{c.activeBookings}</span></td>
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
