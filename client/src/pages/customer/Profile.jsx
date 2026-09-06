import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { showToast } from '../../components/Toast';
import { initials } from '../../utils/format';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', company: user?.company || '', phone: user?.phone || '', address: user?.address || '', businessType: user?.businessType || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);
  const [ps, setPs] = useState({ current: '', newPassword: '', confirm: '' });
  const [psSaving, setPsSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.user);
      showToast('Profile updated');
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  };

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content" style={{ maxWidth: 760 }}>
          <h2 className="page-title">My Profile</h2>
          <p className="page-sub">Manage your account information</p>
          <div className="card mb-3">
            <div className="flex" style={{ gap: 16 }}>
              <span className="avatar avatar-lg" style={{ width: 72, height: 72, fontSize: '1.8rem' }}>{initials(user?.name)}</span>
              <div>
                <h3>{user?.name}</h3>
                <p className="text-muted">{user?.email}</p>
                <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
              </div>
            </div>
          </div>
          <form onSubmit={save} className="card">
            <h3 className="mb-3">Edit Profile</h3>
            <div className="form-row">
              <div className="form-group"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label>Company / Business</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label>Business Type</label><input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} placeholder="e.g. E-commerce" /></div>
            </div>
            <div className="form-group"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
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
            className="card mt-3"
          >
            <h3 className="mb-3">Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={ps.current} onChange={(e) => setPs({ ...ps, current: e.target.value })} placeholder="Your current password" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={ps.newPassword} onChange={(e) => setPs({ ...ps, newPassword: e.target.value })} placeholder="Min 6 chars, upper, lower, number, symbol" required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={ps.confirm} onChange={(e) => setPs({ ...ps, confirm: e.target.value })} placeholder="Re-enter new password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={psSaving}>{psSaving ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
