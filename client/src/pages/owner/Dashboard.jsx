import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [whRes, bkRes] = await Promise.all([
        api.get('/warehouses/mine'),
        api.get('/bookings/owner'),
      ]);
      setWarehouses(whRes);
      setBookings(bkRes);
      setPendingCount(bkRes.filter((b) => b.status === 'pending').length);
    } catch (err) {
      showToast(err.message, 'error');
      setWarehouses([]);
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      showToast(`Booking ${status}`);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const totalAvailable = warehouses.reduce((s, w) => s + (Number(w.availableSpace) || 0), 0);
  const totalSpace = warehouses.reduce((s, w) => s + (Number(w.totalSpace) || 0), 0);
  const activeCount = bookings.filter((b) => b.status === 'active').length;
  const revenue = bookings
    .filter((b) => ['active', 'approved', 'completed'].includes(b.status))
    .reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const customerIds = new Set(bookings.map((b) => b.customerId?._id || b.customerId).filter(Boolean));
  const recent = bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const OWNER_SECTIONS_WITH_COUNT = OWNER_SECTIONS.map((s) =>
    s.to === '/booking-requests' ? { ...s, count: pendingCount } : s
  );

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS_WITH_COUNT} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Welcome back, {user?.name}. Here's an overview of your warehouse business.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Warehouses</div>
                  <div className="stat-value">{warehouses.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Available Space</div>
                  <div className="stat-value">{totalAvailable.toLocaleString()} <span className="text-sm" style={{ fontWeight: 500 }}>sq.ft</span></div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Space</div>
                  <div className="stat-value">{totalSpace.toLocaleString()} <span className="text-sm" style={{ fontWeight: 500 }}>sq.ft</span></div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Bookings</div>
                  <div className="stat-value">{activeCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Requests</div>
                  <div className="stat-value">{pendingCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Monthly Revenue</div>
                  <div className="stat-value">{formatINR(revenue)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Customers</div>
                  <div className="stat-value">{customerIds.size}</div>
                </div>
              </div>

              <div className="card mt-4">
                <div className="flex-between mb-3">
                  <h3>Recent Booking Requests</h3>
                  <Link to="/booking-requests" className="btn btn-soft btn-sm">View all</Link>
                </div>
                {recent.length === 0 ? (
                  <p className="text-muted">No booking requests yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Warehouse</th>
                          <th>Space</th>
                          <th>Start Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((b) => (
                          <tr key={b._id}>
                            <td>
                              <span className="avatar">{b.customerId?.name?.[0]}</span>
                              {b.customerId?.name || 'Customer'}
                            </td>
                            <td>{b.warehouseId?.name || '—'}</td>
                            <td>{b.space} sq.ft</td>
                            <td>{formatDate(b.startDate || b.createdAt)}</td>
                            <td>{formatINR(b.totalAmount)}</td>
                            <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                            <td>
                              {b.status === 'pending' ? (
                                <div className="flex" style={{ gap: 8 }}>
                                  <button className="btn btn-success btn-sm" onClick={() => updateStatus(b._id, 'approved')}>Approve</button>
                                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b._id, 'rejected')}>Reject</button>
                                </div>
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

              <div className="card mt-4">
                <div className="flex-between mb-3">
                  <h3>My Warehouses</h3>
                  <Link to="/my-warehouses" className="btn btn-soft btn-sm">Manage</Link>
                </div>
                {warehouses.length === 0 ? (
                  <p className="text-muted">You haven't listed any warehouses yet. <Link to="/add-warehouse">Add one now</Link>.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Warehouse</th>
                          <th>Location</th>
                          <th>Space</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouses.map((w) => (
                          <tr key={w._id}>
                            <td>{w.name}</td>
                            <td>{w.location}</td>
                            <td>{Number(w.availableSpace || 0).toLocaleString()} / {Number(w.totalSpace || 0).toLocaleString()} sq.ft</td>
                            <td>{formatINR(w.price)}/sq.ft</td>
                            <td><span className={`status status-${w.status}`}>{w.status}</span></td>
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
