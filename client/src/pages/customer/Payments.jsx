import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatINR, formatDate, formatDateTime } from '../../utils/format';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

export default function Payments() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/mine').then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const totalPaid = bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
  const totalDue = bookings.filter((b) => b.paymentStatus !== 'paid' && ['approved', 'active'].includes(b.status)).reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Payments</h2>
          <p className="page-sub">View your payment information</p>
          {loading ? <p className="text-muted">Loading...</p> : (
            <>
              <div className="stat-grid">
                <div className="stat-card"><div className="stat-label">Total Paid</div><div className="stat-value text-success">{formatINR(totalPaid)}</div></div>
                <div className="stat-card"><div className="stat-label">Outstanding</div><div className="stat-value text-danger" style={{ color: 'var(--danger)' }}>{formatINR(totalDue)}</div></div>
                <div className="stat-card"><div className="stat-label">Bookings</div><div className="stat-value">{bookings.length}</div></div>
              </div>
              <div className="card mt-3">
                <h3 className="mb-3">Payment Summary by Booking</h3>
                {bookings.length === 0 ? <p className="text-muted text-sm">No bookings yet.</p> : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Warehouse</th><th>Amount</th><th>Paid</th><th>Payment</th><th>Status</th></tr></thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b._id}>
                            <td className="fw-700">{b.warehouseId?.name}</td>
                            <td>{formatINR(b.totalAmount)}</td>
                            <td>{b.paymentStatus === 'paid' ? formatDate(b.createdAt) : '—'}</td>
                            <td><span className={`status ${b.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>{b.paymentStatus}</span></td>
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
