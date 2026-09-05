import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatDateTime } from '../../utils/format';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

export default function AccessLogs() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/access/logs').then(setLogs).catch(() => setLogs([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Access Logs</h2>
          <p className="page-sub">Track entries to your warehouses</p>
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
