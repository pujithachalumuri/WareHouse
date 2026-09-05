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

export default function Reports() {
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

  const utilization = stats && (stats.totalAvailableSpace || stats.totalOccupiedSpace)
    ? Math.round(((stats.totalOccupiedSpace || 0) / ((stats.totalAvailableSpace || 0) + (stats.totalOccupiedSpace || 0))) * 100)
    : 0;

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Platform Report</h2>
          <p className="page-sub">Comprehensive statistics for the warehouse sharing platform.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : !stats ? (
            <div className="card empty">
              <div className="e-icon">📈</div>
              <p>Failed to load report data.</p>
            </div>
          ) : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">{formatINR(stats.revenue)}</div>
                  <div className="stat-sub">Across all bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                  <div className="stat-sub">Customers {stats.customers || 0} · Owners {stats.owners || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Warehouses</div>
                  <div className="stat-value">{stats.totalWarehouses || 0}</div>
                  <div className="stat-sub">Pending verification {stats.pendingVerification || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Bookings</div>
                  <div className="stat-value">{stats.totalBookings || 0}</div>
                  <div className="stat-sub">Active {stats.activeBookings || 0} · Completed {stats.completedBookings || 0}</div>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">User Breakdown</h3>
                <div className="table-wrap">
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>Registered Users</td>
                        <td><strong>{stats.totalUsers || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Customers</td>
                        <td><strong>{stats.customers || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Warehouse Owners</td>
                        <td><strong>{stats.owners || 0}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Warehouse Statistics</h3>
                <div className="table-wrap">
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>Total Warehouses</td>
                        <td><strong>{stats.totalWarehouses || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Pending Verification</td>
                        <td><strong>{stats.pendingVerification || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Total Available Space</td>
                        <td><strong>{(stats.totalAvailableSpace || 0).toLocaleString()} sq.ft</strong></td>
                      </tr>
                      <tr>
                        <td>Total Occupied Space</td>
                        <td><strong>{(stats.totalOccupiedSpace || 0).toLocaleString()} sq.ft</strong></td>
                      </tr>
                      <tr>
                        <td>Space Utilization Rate</td>
                        <td><strong>{utilization}%</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Booking Statistics</h3>
                <div className="table-wrap">
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>Total Bookings</td>
                        <td><strong>{stats.totalBookings || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Active Bookings</td>
                        <td><strong>{stats.activeBookings || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Completed Bookings</td>
                        <td><strong>{stats.completedBookings || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Total Revenue</td>
                        <td><strong>{formatINR(stats.revenue)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card mt-4">
                <h3 className="mb-3">Engagement</h3>
                <div className="table-wrap">
                  <table className="data-table">
                    <tbody>
                      <tr>
                        <td>Open Complaints</td>
                        <td><strong>{stats.openComplaints || 0}</strong></td>
                      </tr>
                      <tr>
                        <td>Total Reviews</td>
                        <td><strong>{stats.totalReviews || 0}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
