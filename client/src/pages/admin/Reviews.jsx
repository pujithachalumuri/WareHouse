import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatDate } from '../../utils/format';

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

const renderStars = (rating) => {
  const n = Number(rating) || 0;
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? '' : 'dim'}>★</span>
      ))}
    </span>
  );
};

export default function Reviews() {
  const { logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/reviews');
      setReviews(data);
    } catch (err) {
      showToast(err.message, 'error');
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sorted = reviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Reviews</h2>
          <p className="page-sub">All warehouse reviews left by customers.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">⭐</div>
              <p>No reviews found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Warehouse</th>
                    <th>Overall</th>
                    <th>Breakdown</th>
                    <th>Comment</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r._id}>
                      <td>{r.reviewerId?.name || '—'}</td>
                      <td>{r.warehouseId?.name || '—'}</td>
                      <td>{renderStars(r.overall)}</td>
                      <td>
                        <div className="text-sm" style={{ whiteSpace: 'nowrap' }}>
                          Sec {r.security ?? '—'} · Clean {r.cleanliness ?? '—'} · Acc {r.accessibility ?? '—'} · Fac {r.facilities ?? '—'}
                        </div>
                      </td>
                      <td>{r.comment || '—'}</td>
                      <td><span className="tag tag-blue">{r.targetType || 'warehouse'}</span></td>
                      <td>{formatDate(r.createdAt)}</td>
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
