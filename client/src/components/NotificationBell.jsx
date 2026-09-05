import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { timeAgo } from '../utils/format';

export default function NotificationBell() {
  const [data, setData] = useState({ notifications: [], unread: 0 });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    api.get('/notifications/mine').then(setData).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  // poll for new notifications every 20s
  useEffect(() => {
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAll = async () => {
    await api.put('/notifications/read');
    setData((d) => ({ ...d, unread: 0, notifications: d.notifications.map((n) => ({ ...n, read: true })) }));
  };

  const goAll = () => {
    setOpen(false);
    navigate('/notifications');
  };

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-soft btn-sm"
        aria-label="Notifications"
        style={{ position: 'relative', fontWeight: 600 }}
      >
        🔔
        {data.unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--danger)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: 50, padding: '1px 5px' }}>{data.unread}</span>
        )}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="notif-head">
            <strong>Notifications</strong>
            {data.unread > 0 && <button className="btn btn-link btn-xs" onClick={markAll}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {data.notifications.length === 0 ? (
              <p className="text-sm text-muted" style={{ padding: 16, margin: 0, textAlign: 'center' }}>No notifications yet.</p>
            ) : (
              data.notifications.slice(0, 5).map((n) => (
                <div key={n._id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                  <div className="notif-dot">{!n.read && <span />}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong className="text-sm">{n.title}</strong>
                    {n.message && <p className="text-sm text-muted" style={{ margin: 0, wordBreak: 'break-word' }}>{n.message}</p>}
                    <span className="text-xs text-muted">{timeAgo(n.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="notif-foot">
            <Link to="/notifications" onClick={() => setOpen(false)}>View all notifications →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
