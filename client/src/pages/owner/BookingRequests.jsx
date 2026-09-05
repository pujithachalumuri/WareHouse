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

export default function BookingRequests() {
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

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      showToast(`Booking ${status}`);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const confirmPaid = async (id, paid) => {
    try {
      await api.put(`/bookings/${id}/paid`, { paid });
      showToast(paid ? 'Payment confirmed — marked as PAID' : 'Payment request declined');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const sorted = bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pending = sorted.filter((b) => b.status === 'pending').length;

  const OWNER_SECTIONS_WITH_COUNT = OWNER_SECTIONS.map((s) =>
    s.to === '/booking-requests' ? { ...s, count: pending } : s
  );

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS_WITH_COUNT} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Booking Requests</h2>
          <p className="page-sub">Review and respond to booking requests from customers.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">📋</div>
              <p>No booking requests yet.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Warehouse</th>
                    <th>Space</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <span className="avatar">{b.customerId?.name?.[0]}</span>
                        <div>
                          <strong>{b.customerId?.name || 'Customer'}</strong>
                          <div className="text-muted text-sm">{b.customerId?.phone || b.customerId?.company || ''}</div>
                        </div>
                      </td>
                      <td>{b.warehouseId?.name || '—'}</td>
                      <td>{b.spaceRequired} sq.ft</td>
                      <td>{formatDate(b.startDate)} — {formatDate(b.endDate)}</td>
                      <td>{formatINR(b.totalAmount)}</td>
                      <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.paymentStatus === 'paid' ? (
                          <span className="status status-paid">PAID</span>
                        ) : b.paidRequested ? (
                          <div className="flex" style={{ gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => confirmPaid(b._id, true)}>✓ Confirm Paid</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => confirmPaid(b._id, false)}>Decline</button>
                          </div>
                        ) : (
                          <span className="status status-unpaid">unpaid</span>
                        )}
                      </td>
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
      </div>
    </div>
  );
}
