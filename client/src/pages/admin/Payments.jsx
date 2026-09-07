import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import Sidebar from '../../components/Sidebar';
import { formatINR, formatDate } from '../../utils/format';

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

export default function Payments() {
  const { logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/payments');
      setPayments(data);
    } catch (err) {
      showToast(err.message, 'error');
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sorted = payments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const breakdown = (p) => {
    const b = p.bookingId || {};
    const customerPaid = Number(p.amount) || 0;
    const platformFee = Number(b.platformFee) || 0;
    const deposit = Number(b.deposit) || 0;
    const ownerGets = Number(b.spaceRent) || Math.max(0, customerPaid - platformFee - deposit);
    return { customerPaid, platformFee, deposit, ownerGets };
  };

  const totals = sorted.reduce(
    (acc, p) => {
      const d = breakdown(p);
      acc.collected += d.customerPaid;
      acc.fees += d.platformFee;
      acc.owners += d.ownerGets;
      acc.deposits += d.deposit;
      return acc;
    },
    { collected: 0, fees: 0, owners: 0, deposits: 0 }
  );

  return (
    <div className="dashboard">
      <Sidebar sections={ADMIN_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Manage Payments</h2>
          <p className="page-sub">All payments with the platform-fee split between customers and owners.</p>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : sorted.length === 0 ? (
            <div className="card empty">
              <div className="e-icon">💳</div>
              <p>No payments found.</p>
            </div>
          ) : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Collected (Customers Paid)</div>
                  <div className="stat-value">{formatINR(totals.collected)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Platform Fees (5%)</div>
                  <div className="stat-value">{formatINR(totals.fees)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Owner Payouts (Space Rent)</div>
                  <div className="stat-value">{formatINR(totals.owners)}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Deposits Held (10%, Refundable)</div>
                  <div className="stat-value">{formatINR(totals.deposits)}</div>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Warehouse</th>
                      <th>Customer Paid</th>
                      <th>Platform Fee</th>
                      <th>Owner Gets</th>
                      <th>Deposit Held</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p) => {
                      const d = breakdown(p);
                      return (
                        <tr key={p._id}>
                          <td>{p.customerId?.name || '—'}</td>
                          <td>{p.warehouseId?.name || '—'}</td>
                          <td><strong>{formatINR(d.customerPaid)}</strong></td>
                          <td><span className="tag tag-amber">{formatINR(d.platformFee)}</span></td>
                          <td><span className="tag tag-green">{formatINR(d.ownerGets)}</span></td>
                          <td>{formatINR(d.deposit)}</td>
                          <td>{p.method || '—'}</td>
                          <td><span className={`status status-${p.status}`}>{p.status}</span></td>
                          <td>{formatDate(p.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
