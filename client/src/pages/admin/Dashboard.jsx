import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR } from '../../utils/format';

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

export default function Dashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sections = ADMIN_SECTIONS.map((s) =>
    s.to === '/verification' && stats?.pendingVerification
      ? { ...s, count: stats.pendingVerification }
      : s
  );

  return (
    <div className="dashboard">
      <Sidebar sections={sections} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-sub">Platform overview and key metrics at a glance.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : !stats ? (
            <div className="card empty">
              <div className="e-icon">📊</div>
              <p>Failed to load dashboard stats.</p>
            </div>
          ) : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Customers</div>
                  <div className="stat-value">{stats.customers || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Warehouse Owners</div>
                  <div className="stat-value">{stats.owners || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Warehouses</div>
                  <div className="stat-value">{stats.totalWarehouses || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Verification</div>
                  <div className="stat-value">{stats.pendingVerification || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Bookings</div>
                  <div className="stat-value">{stats.totalBookings || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Bookings</div>
                  <div className="stat-value">{stats.activeBookings || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Completed Bookings</div>
                  <div className="stat-value">{stats.completedBookings || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Revenue</div>
                  <div className="stat-value">{formatINR(stats.revenue)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Open Complaints</div>
                  <div className="stat-value">{stats.openComplaints || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Reviews</div>
                  <div className="stat-value">{stats.totalReviews || 0}</div>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Space Utilization</h3>
                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="stat-label">Available Space</div>
                    <div className="stat-value">
                      {(stats.totalAvailableSpace || 0).toLocaleString()}{' '}
                      <span className="text-sm" style={{ fontWeight: 500 }}>sq.ft</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Occupied Space</div>
                    <div className="stat-value">
                      {(stats.totalOccupiedSpace || 0).toLocaleString()}{' '}
                      <span className="text-sm" style={{ fontWeight: 500 }}>sq.ft</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Utilization Rate</div>
                    <div className="stat-value">
                      {stats.totalAvailableSpace || stats.totalOccupiedSpace
                        ? Math.round(
                            ((stats.totalOccupiedSpace || 0) /
                              ((stats.totalAvailableSpace || 0) + (stats.totalOccupiedSpace || 0))) *
                              100
                          )
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Quick Summary</h3>
                <p className="text-muted">
                  The platform currently has <strong>{stats.totalUsers || 0}</strong> registered users
                  ({stats.customers || 0} customers, {stats.owners || 0} warehouse owners).
                  There {stats.pendingVerification === 1 ? 'is' : 'are'}{' '}
                  <strong>{stats.pendingVerification || 0}</strong> warehouse{stats.pendingVerification !== 1 && 's'} pending verification,
                  <strong> {stats.openComplaints || 0}</strong> open complaint{stats.openComplaints !== 1 && 's'},
                  and total revenue of <strong>{formatINR(stats.revenue)}</strong>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
