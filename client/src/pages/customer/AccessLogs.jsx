import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { showToast } from '../../components/Toast';
import { formatDateTime } from '../../utils/format';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

export default function AccessLogs() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/access/logs').then(setLogs).catch(() => setLogs([]));
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const verify = async (accessType) => {
    setBusy(true);
    try {
      const bookings = await api.get('/bookings/mine').catch(() => []);
      const wh = bookings.find((b) => b.status === 'active' || b.status === 'approved')?.warehouseId;
      if (!wh) { showToast('No active booking found. Book a warehouse first.', 'error'); return; }
      const res = await api.post('/access/verify', { warehouseId: wh._id || wh, accessType });
      showToast(res.granted ? `${accessType} granted` : `${accessType} denied`, res.granted ? 'success' : 'error');
      load();
    } catch (err) { showToast(err.message, 'error'); }
    setBusy(false);
  };

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <div className="flex-between">
            <div><h2 className="page-title">Access Logs</h2><p className="page-sub">Track entries to your warehouses</p></div>
            <div className="flex" style={{ gap: 8 }}>
              <button className="btn btn-outline btn-sm" disabled={busy} onClick={() => verify('entry')}>🟢 Simulate Entry</button>
              <button className="btn btn-outline btn-sm" disabled={busy} onClick={() => verify('exit')}>🟡 Simulate Exit</button>
            </div>
          </div>
          {loading ? <p className="text-muted">Loading...</p> : logs.length === 0 ? (
            <div className="empty"><div className="e-icon">🕒</div><p>No access logs yet. Entry/exit events will appear here.</p></div>
          ) : (
            <div className="card">
              <div className="table-wrap" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead><tr><th>User</th><th>Warehouse</th><th>Date</th><th>Time</th><th>Type</th><th>Method</th><th>Status</th></tr></thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l._id}>
                        <td className="fw-700">{l.userName}</td>
                        <td>{l.warehouseName}</td>
                        <td>{formatDateTime(l.createdAt).split(',')[0]}</td>
                        <td>{formatDateTime(l.createdAt).split(',')[1]}</td>
                        <td><span className={`tag ${l.accessType === 'entry' ? 'tag-green' : 'tag-amber'}`}>{l.accessType}</span></td>
                        <td><span className="tag">🛡️ {l.method}</span></td>
                        <td><span className={`status ${l.status === 'granted' ? 'status-active' : 'status-rejected'}`}>{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
