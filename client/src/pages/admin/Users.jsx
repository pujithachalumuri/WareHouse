import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatDateTime, initials } from '../../utils/format';

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

export default function Users() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      showToast(err.message, 'error');
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async (u) => {
    const newStatus = u.status === 'blocked' ? 'active' : 'blocked';
    try {
      await api.put(`/admin/users/${u._id}`, { status: newStatus });
      showToast(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const changeRole = async (u, role) => {
    try {
      await api.put(`/admin/users/${u._id}`, { role });
      showToast('Role updated');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Users</h2>
          <p className="page-sub">Manage all registered users on the platform.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : users.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">👥</div>
              <p>No users found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <span className="avatar" style={{ fontSize: '0.8rem' }}>{initials(u.name)}</span>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                      <td><span className={`status status-${u.status}`}>{u.status}</span></td>
                      <td>{formatDateTime(u.createdAt)}</td>
                      <td>
                        {u._id === user?._id ? (
                          <span className="text-muted text-sm">You</span>
                        ) : (
                          <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                            <button
                              className={`btn ${u.status === 'blocked' ? 'btn-success' : 'btn-danger'} btn-sm`}
                              onClick={() => toggleBlock(u)}
                            >
                              {u.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                            <select
                              className="btn btn-soft btn-sm"
                              value={u.role}
                              onChange={(e) => changeRole(u, e.target.value)}
                            >
                              <option value="customer">Customer</option>
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
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
