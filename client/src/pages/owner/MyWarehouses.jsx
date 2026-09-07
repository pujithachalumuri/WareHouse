import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR } from '../../utils/format';

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

export default function MyWarehouses() {
  const { logout } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/warehouses/mine');
      setWarehouses(data);
    } catch (err) {
      showToast(err.message, 'error');
      setWarehouses([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) return;
    try {
      await api.del(`/warehouses/${id}`);
      showToast('Warehouse deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <div className="flex-between">
            <div>
              <h2 className="page-title">My Warehouses</h2>
              <p className="page-sub">Manage your listed warehouse spaces.</p>
            </div>
            <Link to="/add-warehouse" className="btn btn-primary">➕ Add Warehouse</Link>
          </div>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : warehouses.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">🏗️</div>
              <p>You haven't listed any warehouses yet.</p>
              <Link to="/add-warehouse" className="btn btn-primary mt-3">Add Your First Warehouse</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Location</th>
                    <th>Space</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((w) => (
                    <tr key={w._id}>
                      <td>
                        <strong>{w.name}</strong>
                        <div className="text-muted text-sm">{w.storageType} · {w.warehouseType}</div>
                      </td>
                      <td>{w.location}</td>
                      <td>{Number(w.availableSpace || 0).toLocaleString()} / {Number(w.totalSpace || 0).toLocaleString()} sq.ft</td>
                      <td>{formatINR(w.price)}<span className="text-muted text-sm">/sq.ft</span></td>
                      <td><span className={`status status-${w.status}`}>{w.status}</span></td>
                      <td>
                        <span className={`tag ${w.verificationStatus === 'verified' ? 'tag-green' : w.verificationStatus === 'rejected' ? 'tag-red' : 'tag-amber'}`}>
                          {w.verificationStatus || 'pending'}
                        </span>
                        {(w.verificationVideo || (Array.isArray(w.verificationDocuments) && w.verificationDocuments.length)) ? (
                          <div className="text-muted text-sm" style={{ marginTop: 4 }}>📎 proof uploaded</div>
                        ) : null}
                      </td>
                      <td>
                        <div className="flex" style={{ gap: 8 }}>
                          <Link to={`/edit-warehouse/${w._id}`} className="btn btn-soft btn-sm">Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(w._id)}>Delete</button>
                        </div>
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
