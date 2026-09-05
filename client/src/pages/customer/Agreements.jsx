import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatINR, formatDate } from '../../utils/format';
import { CUSTOMER_SECTIONS } from '../../utils/sections';

const TERMS = [
  'Rent is payable in advance on the 1st of each month during the rental period.',
  'A security deposit of 10% of the total rent is collected and refunded on satisfactory completion.',
  'The lessee may store only items declared and within the rented space.',
  'The lessor provides 24/7 secured access to authorized personnel only.',
  'Either party may terminate the agreement with 30 days written notice.',
  'The lessee is responsible for insuring stored goods.',
  'Any damage to the warehouse caused by stored goods is the lessee\'s responsibility.',
  'Disputes shall be settled per the governing jurisdiction.',
];

export default function Agreements() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/bookings/mine').then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const agreements = bookings.filter((b) => b.agreementGenerated);

  const download = (b) => {
    window.print();
  };

  return (
    <div className="dashboard">
      <Sidebar sections={CUSTOMER_SECTIONS} onLogout={logout} />
      <div className="dash-main">
        <div className="dash-content">
          <h2 className="page-title">Digital Rental Agreements</h2>
          <p className="page-sub">View and download your rental agreements</p>
          {loading ? <p className="text-muted">Loading...</p> : agreements.length === 0 ? (
            <div className="empty"><div className="e-icon">📝</div><p>No agreements yet. They appear once your booking is approved.</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Warehouse</th><th>Space</th><th>Period</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {agreements.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-700">{b.warehouseId?.name}</td>
                      <td>{b.spaceRequired?.toLocaleString()} sq.ft</td>
                      <td className="text-sm">{formatDate(b.startDate)} → {formatDate(b.endDate)}</td>
                      <td>{formatINR(b.totalAmount)}</td>
                      <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                      <td>
                        <div className="flex" style={{ gap: 6 }}>
                          <button className="btn btn-soft btn-sm" onClick={() => setSelected(b)}>View Agreement</button>
                          <button className="btn btn-primary btn-sm" onClick={() => download(b)}>Download</button>
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

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
          <div className="card" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-between mb-2">
              <h3>📄 Rental Agreement</h3>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-blue)', borderRadius: 10, marginBottom: 16 }}>
              <h2 style={{ color: 'var(--primary)' }}>STORAGE RENTAL AGREEMENT</h2>
              <p className="text-sm text-muted">Between {selected.customerId?.name} (Lessee) and {selected.ownerId?.name} (Lessor)</p>
            </div>
            <div className="form-row">
              <div className="price-row" style={{ border: 'none' }}><span className="lbl">Warehouse</span><strong>{selected.warehouseId?.name}</strong></div>
              <div className="price-row" style={{ border: 'none' }}><span className="lbl">Location</span><span>{selected.warehouseId?.location}</span></div>
            </div>
            <div className="price-row"><span className="lbl">Rented Space</span><strong>{selected.spaceRequired?.toLocaleString()} sq.ft</strong></div>
            <div className="price-row"><span className="lbl">Rental Period</span><span>{formatDate(selected.startDate)} → {formatDate(selected.endDate)}</span></div>
            <div className="price-row"><span className="lbl">Rent</span><strong>{formatINR(selected.spaceRent)}</strong></div>
            <div className="price-row"><span className="lbl">Deposit</span><strong>{formatINR(selected.deposit)}</strong></div>
            <div className="price-row"><span className="lbl">Platform Fee</span><strong>{formatINR(selected.platformFee)}</strong></div>
            <div className="price-row total"><span>Total</span><span>{formatINR(selected.totalAmount)}</span></div>
            <div style={{ marginTop: 16 }}>
              <strong className="text-sm mb-1" style={{ display: 'block' }}>Terms & Conditions</strong>
              <ol style={{ paddingLeft: 20, fontSize: '0.85rem', color: 'var(--muted)' }}>
                {TERMS.map((t, i) => <li key={i} style={{ margin: '4px 0' }}>{t}</li>)}
              </ol>
            </div>
            <div className="flex-between mt-3">
              <div className="text-center"><div className="text-sm fw-700">Lessee</div><div className="text-muted text-sm">{selected.customerId?.name}</div></div>
              <div className="text-center"><div className="text-sm fw-700">Lessor</div><div className="text-muted text-sm">{selected.ownerId?.name}</div></div>
              <div className="text-center"><div className="text-sm fw-700">Date</div><div className="text-muted text-sm">{formatDate(Date.now())}</div></div>
            </div>
            <button className="btn btn-primary btn-block mt-3" onClick={() => window.print()}>Download Agreement</button>
          </div>
        </div>
      )}
    </div>
  );
}
