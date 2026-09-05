import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR, formatDate, calculateMonths } from '../../utils/format';

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

const TERMS = [
  'This Agreement is entered into between the Warehouse Owner and the Customer for the rental of warehouse space.',
  'The Customer agrees to pay the rental, deposit, and platform fees as specified in the booking.',
  'The rental period begins on the start date and continues until the end date as specified in the booking.',
  'The security deposit will be refundable subject to the warehouse being returned in its original condition.',
  'The Customer shall use the space only for lawful storage purposes.',
  'Any damages caused to the warehouse premises will be the responsibility of the Customer.',
  'The Owner reserves the right to terminate this agreement in case of breach of terms.',
  'Both parties agree to resolve any disputes through amicable negotiation before escalation.',
];

export default function Agreements() {
  const { logout } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings/owner');
      setAgreements(data.filter((b) => b.agreementGenerated));
    } catch (err) {
      showToast(err.message, 'error');
      setAgreements([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const download = (ag) => {
    window.print();
  };

  return (
    <div className="dashboard">
      <Sidebar sections={OWNER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Agreements</h2>
          <p className="page-sub">Rental agreements generated for your bookings.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : agreements.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">📝</div>
              <p>No agreements generated yet. Agreements appear once bookings are finalized.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Warehouse</th>
                    <th>Space</th>
                    <th>Dates</th>
                    <th>Rent</th>
                    <th>Deposit</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((b) => {
                    const months = calculateMonths(b.startDate, b.endDate) || 1;
                    const rent = Number(b.space || 0) * Number(b.warehouseId?.price || 0) * months;
                    const deposit = Math.round(rent * 0.1);
                    const fee = Math.round(rent * 0.05);
                    return (
                      <tr key={b._id}>
                        <td><strong>{b.customerId?.name || 'Customer'}</strong></td>
                        <td>{b.warehouseId?.name || '—'}</td>
                        <td>{b.space} sq.ft</td>
                        <td>{formatDate(b.startDate)} — {formatDate(b.endDate)}</td>
                        <td>{formatINR(rent)}</td>
                        <td>{formatINR(deposit)}</td>
                        <td>{formatINR(fee)}</td>
                        <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                        <td>
                          <div className="flex" style={{ gap: 8 }}>
                            <button className="btn btn-soft btn-sm" onClick={() => setViewing(b)}>View Agreement</button>
                            <button className="btn btn-outline btn-sm" onClick={() => download(b)}>Download Agreement</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>
          <div className="card" style={{ maxWidth: 720, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex-between mb-3">
              <h3>Warehouse Rental Agreement</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewing(null)}>✕ Close</button>
            </div>
            <div className="text-muted text-sm mb-2">
              Between Warehouse Owner and {viewing.customerId?.name || 'Customer'} for {viewing.warehouseId?.name || 'warehouse'} ({viewing.space} sq.ft)
            </div>
            <div className="mb-3 text-sm">
              <div><strong>Rental period:</strong> {formatDate(viewing.startDate)} — {formatDate(viewing.endDate)}</div>
              <div><strong>Status:</strong> {viewing.status}</div>
            </div>
            <ol style={{ paddingLeft: 20 }}>
              {TERMS.map((t, i) => (
                <li key={i} className="text-sm mb-2">{t}</li>
              ))}
            </ol>
            <div className="flex-between mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <button className="btn btn-primary" onClick={() => { window.print(); }}>Download Agreement</button>
              <button className="btn btn-ghost" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
