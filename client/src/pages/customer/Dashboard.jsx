import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatINR, formatDate, timeAgo } from '../../utils/format';
import { showToast } from '../../components/Toast';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

function Stars({ value, onChange }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange && onChange(s)}
          style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', color: s <= (value || 0) ? 'var(--warning)' : '#cfd8e3' }}
        >★</button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // review form
  const [reviewFor, setReviewFor] = useState(null);
  const [review, setReview] = useState({ overall: 5, security: 5, cleanliness: 5, accessibility: 5, facilities: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/mine').catch(() => []),
      api.get('/inventory/mine').catch(() => []),
      api.get('/notifications/mine').then((d) => d.notifications).catch(() => []),
    ]).then(([b, i, n]) => { setBookings(b); setInventory(i); setNotifications(n); })
      .finally(() => setLoading(false));
  }, []);

  const active = bookings.find((b) => b.status === 'active');
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const totalProducts = inventory.reduce((s, i) => s + i.quantity, 0);
  const lowStock = inventory.filter((i) => i.lowStockThreshold && i.quantity <= i.lowStockThreshold).length;
  const expiringSoon = inventory.filter((i) => i.expiryDate && new Date(i.expiryDate) - Date.now() < 30 * 86400000).length;
  const reviewable = bookings.filter((b) => ['approved', 'active', 'completed'].includes(b.status));

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewFor) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        warehouseId: reviewFor.warehouseId._id,
        vendorId: reviewFor.ownerId?._id || reviewFor.ownerId,
        targetType: 'warehouse',
        ...review,
      });
      showToast('Thanks for your review!');
      setReviewFor(null);
      setReview({ overall: 5, security: 5, cleanliness: 5, accessibility: 5, facilities: 5, comment: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const summary = (label, value, sub) => (
    <div className="stat-card"><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{sub && <div className="stat-sub">{sub}</div>}</div>
  );

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Customer Dashboard</h2>
          <p className="page-sub">Welcome back, {user?.name}</p>
          {loading ? <p className="text-muted">Loading...</p> : (
            <>
              {/* Recent notifications at top */}
              {notifications.length > 0 && (
                <div className="card mt-2 notif-banner">
                  <div className="flex-between mb-1">
                    <h3 className="text-sm" style={{ margin: 0 }}>🔔 Recent Notifications</h3>
                    <Link to="/notifications" className="text-primary text-sm fw-700">View all</Link>
                  </div>
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n._id} className="notif-line">
                      <span className="text-sm fw-700">{n.title}</span>
                      <span className="text-sm text-muted" style={{ flex: 1 }}>{n.message}</span>
                      <span className="text-xs text-muted">{timeAgo(n.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="stat-grid">
                {summary('Active Booking', active ? 'Yes' : 'None', active ? `${active.warehouseId?.name || ''}` : 'No active rental')}
                {summary('Pending Requests', pending)}
                {summary('Total Products', inventory.length)}
                {summary('Total Quantity', totalProducts, `${lowStock} low stock`)}
                {summary('Expiring Soon', expiringSoon, 'within 30 days')}
              </div>

              {active && (
                <div className="card mt-3">
                  <h3 className="mb-3">🟢 Active Booking</h3>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <p className="text-muted text-sm">Warehouse</p>
                      <strong>{active.warehouseId?.name}</strong>
                      <p className="text-muted text-sm mt-1">📍 {active.warehouseId?.location}</p>
                      <p className="text-muted text-sm">Space Rented</p>
                      <strong>{active.spaceRequired?.toLocaleString()} sq.ft</strong>
                      <p className="text-muted text-sm mt-2">Rental Period</p>
                      <strong>{formatDate(active.startDate)} → {formatDate(active.endDate)}</strong>
                    </div>
                    <div>
                      <p className="text-muted text-sm">Total Amount</p>
                      <strong className="text-primary">{formatINR(active.totalAmount)}</strong>
                      <p className="text-muted text-sm mt-1">Payment Status</p>
                      <div className="pay-status-big">
                        {active.paymentStatus === 'paid' ? (
                          <span className="pay-badge paid">✓ PAID</span>
                        ) : (
                          <span className="pay-badge unpaid">⏳ UNPAID</span>
                        )}
                      </div>
                      <div className="flex" style={{ gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                        <span className={`status status-${active.status}`}>{active.status}</span>
                        <span className={`status ${active.agreementGenerated ? 'status-active' : 'status-pending'}`}>{active.agreementGenerated ? 'Agreement Ready' : 'Agreement Pending'}</span>
                      </div>
                      <div className="flex" style={{ gap: 8, marginTop: 14 }}>
                        <Link to={`/booking/${active._id}`} className="btn btn-primary btn-sm">View Booking</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!active && bookings.length === 0 && (
                <div className="card mt-3 empty">
                  <div className="e-icon">📦</div>
                  <h3 className="mb-2">No bookings yet</h3>
                  <p className="text-muted mb-3">Find warehouse space and start renting only what you need.</p>
                  <Link to="/find" className="btn btn-primary">Find Warehouse</Link>
                </div>
              )}

              {bookings.length > 0 && (
                <div className="mt-3">
                  <div className="flex-between mb-2">
                    <h3>Recent Bookings</h3>
                    <Link to="/my-bookings" className="text-primary text-sm fw-700">View all</Link>
                  </div>
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Warehouse</th><th>Space</th><th>Period</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b._id}>
                            <td><Link to={`/booking/${b._id}`} className="text-primary fw-700">{b.warehouseId?.name || '—'}</Link></td>
                            <td>{b.spaceRequired?.toLocaleString()} sq.ft</td>
                            <td>{formatDate(b.startDate)} → {formatDate(b.endDate)}</td>
                            <td>{formatINR(b.totalAmount)}</td>
                            <td><span className={`status ${b.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>{b.paymentStatus === 'paid' ? '✓ PAID' : 'unpaid'}</span></td>
                            <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Review submission for approved/active/completed bookings */}
              {reviewable.length > 0 && (
                <div className="card mt-3">
                  <h3 className="mb-2">⭐ Rate your warehouse</h3>
                  <p className="text-sm text-muted mb-2">Share your experience to help others (and the owner).</p>
                  {reviewFor ? (
                    <div>
                      <p className="fw-700 mb-2">Reviewing: {reviewFor.warehouseId?.name}</p>
                      <form onSubmit={submitReview}>
                        <div className="rating-grid">
                          {[['overall', 'Overall'], ['security', 'Security'], ['cleanliness', 'Cleanliness'], ['accessibility', 'Accessibility'], ['facilities', 'Facilities']].map(([k, label]) => (
                            <div key={k} className="rating-item">
                              <span className="text-sm">{label}</span>
                              <Stars value={review[k]} onChange={(v) => setReview({ ...review, [k]: v })} />
                            </div>
                          ))}
                        </div>
                        <div className="form-group mt-2">
                          <textarea rows="3" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Write your review..." />
                        </div>
                        <div className="flex" style={{ gap: 8 }}>
                          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
                          <button type="button" className="btn btn-soft btn-sm" onClick={() => setReviewFor(null)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {reviewable.map((b) => (
                        <button key={b._id} className="btn btn-soft btn-sm" onClick={() => setReviewFor(b)}>⭐ {b.warehouseId?.name || 'Warehouse'}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="card mt-3">
                <h3 className="mb-3">📦 Inventory Summary</h3>
                {inventory.length === 0 ? (
                  <p className="text-muted text-sm">No products tracked yet. <Link to="/inventory" className="text-primary fw-700">Manage inventory →</Link></p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Product</th><th>SKU</th><th>Quantity</th><th>Warehouse</th><th>Rack</th></tr></thead>
                      <tbody>
                        {inventory.slice(0, 5).map((i) => (
                          <tr key={i._id}>
                            <td className="fw-700">{i.productName}</td>
                            <td>{i.sku || '—'}</td>
                            <td>{i.quantity}</td>
                            <td>{i.warehouseId?.name || '—'}</td>
                            <td>{i.rack || '—'}</td>
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
