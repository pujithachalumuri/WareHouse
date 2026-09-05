import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { timeAgo, initials, formatINR } from '../../utils/format';
import { CUSTOMER_SECTIONS, OWNER_SECTIONS } from '../../utils/sections';

export default function Notifications() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ notifications: [], unread: 0 });
  const [loading, setLoading] = useState(true);
  const isOwner = user?.role === 'owner';
  const sections = isOwner ? OWNER_SECTIONS : CUSTOMER_SECTIONS;

  const load = () => api.get('/notifications/mine').then(setData).catch(() => setData({ notifications: [], unread: 0 })).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.put('/notifications/read');
    setData({ ...data, unread: 0, notifications: data.notifications.map((n) => ({ ...n, read: true })) });
  };

  return (
    <div className="dashboard">
      <Sidebar sections={sections} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content" style={{ maxWidth: 800 }}>
          <div className="flex-between">
            <div><h2 className="page-title">Notifications</h2><p className="page-sub">{data.unread} unread</p></div>
            {data.unread > 0 && <button className="btn btn-soft btn-sm" onClick={markAll}>Mark all read</button>}
          </div>
          {loading ? <p className="text-muted">Loading...</p> : data.notifications.length === 0 ? (
            <div className="empty"><div className="e-icon">🔔</div><p>No notifications yet.</p></div>
          ) : (
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.notifications.map((n) => (
                  <div key={n._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem', flexShrink: 0 }}>{initials(n.title)}</span>
                    <div style={{ flex: 1 }}>
                      <div className="flex-between">
                        <strong className="text-sm">{n.title}</strong>
                        <span className="text-sm text-muted" style={{ whiteSpace: 'nowrap' }}>{timeAgo(n.createdAt)}</span>
                      </div>
                      {n.message && <p className="text-sm text-muted mt-1">{n.message}</p>}
                      <span className="tag" style={{ marginTop: 6 }}>{n.type}</span>
                    </div>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: 50, background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link to={isOwner ? '/owner-dashboard' : '/dashboard'} className="text-primary text-sm fw-700">← Back to {isOwner ? 'owner' : 'customer'} dashboard</Link>
        </div>
      </div>
    </div>
  );
}
