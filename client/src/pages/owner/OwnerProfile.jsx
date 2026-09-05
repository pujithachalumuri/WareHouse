import { useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { initials } from '../../utils/format';

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

export default function OwnerProfile() {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [ps, setPs] = useState({ current: '', newPassword: '', confirm: '' });
  const [psSaving, setPsSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.user || res);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Profile</h2>
          <p className="page-sub">View and update your owner profile.</p>

          <div className="card mb-4">
            <div className="flex" style={{ gap: 20 }}>
              <span className="avatar avatar-lg">{initials(user?.name)}</span>
              <div>
                <h3>{user?.name}</h3>
                <p className="text-muted text-sm mb-1">{user?.email}</p>
                <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
                {user?.company && <p className="text-muted text-sm mt-2">{user.company}</p>}
                {user?.phone && <p className="text-muted text-sm">📞 {user.phone}</p>}
                {user?.address && <p className="text-muted text-sm">📍 {user.address}</p>}
                {user?.bio && <p className="text-muted text-sm mt-2">{user.bio}</p>}
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="card">
            <h3 className="mb-3">Edit Profile</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your business / company name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your address" />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell customers a little about your warehouses" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (ps.newPassword !== ps.confirm) {
                showToast("New passwords don't match", 'error');
                return;
              }
              setPsSaving(true);
              api
                .put('/auth/profile', { currentPassword: ps.current, password: ps.newPassword })
                .then(() => {
                  showToast('Password changed successfully');
                  setPs({ current: '', newPassword: '', confirm: '' });
                })
                .catch((err) => showToast(err.message || 'Failed to change password', 'error'))
                .finally(() => setPsSaving(false));
            }}
            className="card mt-4"
          >
            <h3 className="mb-3">Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={ps.current}
                onChange={(e) => setPs({ ...ps, current: e.target.value })}
                placeholder="Your current password"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={ps.newPassword}
                  onChange={(e) => setPs({ ...ps, newPassword: e.target.value })}
                  placeholder="Min 6 chars, upper, lower, number, symbol"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={ps.confirm}
                  onChange={(e) => setPs({ ...ps, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={psSaving}>
              {psSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
