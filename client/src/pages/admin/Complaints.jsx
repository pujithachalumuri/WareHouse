import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { timeAgo } from '../../utils/format';

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

export default function Complaints() {
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [resolutions, setResolutions] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/complaints');
      setComplaints(data);
    } catch (err) {
      showToast(err.message, 'error');
      setComplaints([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateComplaint = async (c, status) => {
    try {
      await api.put(`/admin/complaints/${c._id}`, { status, resolution: resolutions[c._id] || c.resolution || '' });
      showToast(`Complaint marked ${status}`);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const sorted = complaints.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Complaints</h2>
          <p className="page-sub">Review and resolve user complaints.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">⚠️</div>
              <p>No complaints found.</p>
            </div>
          ) : (
            <div className="grid" style={{ gap: 16 }}>
              {sorted.map((c) => (
                <div className="card" key={c._id}>
                  <div className="flex-between mb-2">
                    <h3>{c.subject}</h3>
                    <span className={`status ${c.status === 'resolved' ? 'status-completed' : c.status === 'in-progress' ? 'status-active' : 'status-pending'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-muted mb-2">
                    <strong>From:</strong> {c.customerName || 'Customer'} {c.relatedTo ? `· Related to: ${c.relatedTo}` : ''}
                  </p>
                  <p className="mb-2">{c.description}</p>
                  <p className="text-muted text-sm mb-3">{timeAgo(c.createdAt)}</p>

                  {c.resolution && (
                    <p className="text-sm mb-3">
                      <strong>Resolution:</strong> {c.resolution}
                    </p>
                  )}

                  {c.status !== 'resolved' && (
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <input
                        type="text"
                        placeholder="Add resolution note..."
                        value={resolutions[c._id] ?? ''}
                        onChange={(e) => setResolutions((r) => ({ ...r, [c._id]: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex" style={{ gap: 8 }}>
                    {c.status === 'open' && (
                      <button className="btn btn-soft btn-sm" onClick={() => updateComplaint(c, 'in-progress')}>Mark In Progress</button>
                    )}
                    {c.status !== 'resolved' && (
                      <button className="btn btn-success btn-sm" onClick={() => updateComplaint(c, 'resolved')}>Resolve</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
