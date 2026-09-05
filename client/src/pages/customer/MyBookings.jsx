import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatINR, formatDate } from '../../utils/format';
import { showToast } from '../../components/Toast';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

export default function MyBookings() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/bookings/mine').then(setBookings).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
      showToast('Booking cancelled');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const requestPaid = async (id) => {
    try {
      await api.put(`/bookings/${id}/request-paid`);
      showToast('Payment request sent to owner');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">My Bookings</h2>
          <p className="page-sub">Track and manage your storage bookings</p>
          {loading ? <p className="text-muted">Loading...</p> : bookings.length === 0 ? (
            <div className="empty">
              <div className="e-icon">📋</div>
              <p className="mb-3">You have no bookings yet.</p>
              <Link to="/find" className="btn btn-primary">Find Warehouse</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Warehouse</th><th>Space</th><th>Period</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <Link to={`/booking/${b._id}`} className="fw-700 text-primary">{b.warehouseId?.name || '—'}</Link>
                        <div className="text-sm text-muted">{b.warehouseId?.location}</div>
                      </td>
                      <td>{b.spaceRequired?.toLocaleString()} sq.ft</td>
                      <td className="text-sm">{formatDate(b.startDate)}<br />→ {formatDate(b.endDate)}</td>
                      <td>{formatINR(b.totalAmount)}</td>
                      <td>
                        <span className={`status ${b.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>{b.paymentStatus}</span>
                        {b.paidRequested && b.paymentStatus !== 'paid' && <div className="text-sm text-muted">Request sent</div>}
                      </td>
                      <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                      <td>
                        <div className="flex" style={{ gap: 6 }}>
                          <Link to={`/booking/${b._id}`} className="btn btn-soft btn-sm">Details</Link>
                          {(b.status === 'pending' || b.status === 'approved') && (
                            <button className="btn btn-danger btn-sm" onClick={() => cancel(b._id)}>Cancel</button>
                          )}
                          {b.paymentStatus !== 'paid' && ['approved', 'active', 'completed'].includes(b.status) && (
                            b.paidRequested ? (
                              <button className="btn btn-ghost btn-sm" disabled>Request Sent</button>
                            ) : (
                              <button className="btn btn-success btn-sm" onClick={() => requestPaid(b._id)}>Mark as Paid</button>
                            )
                          )}
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
