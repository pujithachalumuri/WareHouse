import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import { formatINR, formatDate, bookingPrice, calculateMonths, initials } from '../../utils/format';

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? '' : 'dim'}>★</span>
      ))}
    </span>
  );
}

export default function WarehouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [space, setSpace] = useState(500);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [review, setReview] = useState({ security: 5, cleanliness: 5, accessibility: 5, facilities: 5, overall: 5, comment: '' });

  useEffect(() => {
    api.get(`/warehouses/${id}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><p>Loading...</p></div>;
  if (!data?.warehouse) return <div className="container section"><div className="empty"><p>Warehouse not found.</p><Link to="/find" className="btn btn-primary btn-sm mt-2">Back to search</Link></div></div>;

  const w = data.warehouse;
  const months = calculateMonths(startDate, endDate);
  const price = bookingPrice(space, w.price, months);

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Please login to book', 'error'); navigate('/login'); return; }
    if (space > w.availableSpace) { showToast(`Only ${w.availableSpace} sq.ft available`, 'error'); return; }
    if (!startDate || !endDate) { showToast('Select rental dates', 'error'); return; }
    if (new Date(endDate) <= new Date(startDate)) { showToast('End date must be after start date', 'error'); return; }
    try {
      await api.post('/bookings', { warehouseId: w._id, spaceRequired: space, startDate, endDate });
      showToast('Booking request submitted successfully.');
      navigate('/my-bookings');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { warehouseId: w._id, ...review });
      showToast('Review submitted! Thank you.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="section" style={{ paddingTop: 32 }}>
      <div className="container">
        <Link to="/find" className="text-primary text-sm fw-700">← Back to search</Link>

        <div className="grid mt-2" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
          <div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', height: 360, background: 'var(--primary-light)' }}>
              {w.images?.[activeImg] ? <img src={w.images[activeImg]} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📦</div>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {w.images?.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 64, borderRadius: 8, overflow: 'hidden', border: i === activeImg ? '2px solid var(--primary)' : '2px solid var(--border)', padding: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            <h1 className="mt-3" style={{ fontSize: '1.7rem' }}>{w.name}</h1>
            <div className="flex" style={{ gap: 12, margin: '8px 0' }}>
              <span className="text-muted">📍 {w.location}</span>
              {w.rating > 0 && <span className="flex" style={{ gap: 4 }}><Stars rating={w.rating} /><span className="text-sm text-muted">({w.ratingCount})</span></span>}
            </div>
            <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
              <span className="tag tag-blue">{w.storageType}</span>
              <span className="tag tag-green">{w.warehouseType}</span>
              <span className="tag"><strong>{w.availableSpace.toLocaleString()} sq.ft</strong> available</span>
            </div>
            <p style={{ color: 'var(--muted)', maxWidth: 640 }}>{w.description || 'Flexible warehouse space available for partial rental.'}</p>

            <div className="grid mt-3" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="card">
                <h3 className="mb-2">Warehouse Details</h3>
                {[
                  ['Total Area', `${w.totalSpace?.toLocaleString()} sq.ft`],
                  ['Available Area', `${w.availableSpace?.toLocaleString()} sq.ft`],
                  ['Price', `${formatINR(w.price)}/sq.ft/month`],
                  ['Min. Rental', `${w.minimumDuration} month(s)`],
                ].map(([k, v]) => (
                  <div className="price-row" key={k}><span className="lbl">{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <div className="card">
                <h3 className="mb-2">Facilities</h3>
                <div className="wh-meta" style={{ marginBottom: 12 }}>
                  {w.facilities?.map((f) => <span className="tag tag-blue" key={f}>✓ {f}</span>)}
                </div>
                <h3 className="mb-2">Security</h3>
                <div className="wh-meta">
                  {w.security?.map((s) => <span className="tag" key={s}>🛡️ {s}</span>)}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card mt-3">
              <h3 className="mb-3">Ratings & Reviews</h3>
              {data.reviews?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {data.reviews.map((r) => (
                    <div key={r._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                      <div className="flex-between">
                        <div className="flex" style={{ gap: 8 }}>
                          <span className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials(r.reviewerId?.name)}</span>
                          <strong className="text-sm">{r.reviewerId?.name}</strong>
                        </div>
                        <Stars rating={r.overall} />
                      </div>
                      {r.comment && <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted text-sm">No reviews yet.</p>}

              {user && user.role === 'customer' && (
                <form onSubmit={submitReview} className="mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <h4 className="mb-2">Rate this warehouse</h4>
                  <div className="form-row-3">
                    {[['security', 'Security'], ['cleanliness', 'Cleanliness'], ['accessibility', 'Accessibility'], ['facilities', 'Facilities'], ['overall', 'Overall']].map(([k, lbl]) => (
                      <div className="form-group" style={{ marginBottom: 12 }} key={k}>
                        <label className="text-sm">{lbl}</label>
                        <select value={review[k]} onChange={(e) => setReview({ ...review, [k]: e.target.value })}>
                          {[1, 2, 3, 4, 5].map((i) => <option key={i} value={i}>{'★'.repeat(i)}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="text-sm">Comment</label>
                    <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience..." />
                  </div>
                  <button className="btn btn-primary btn-sm">Submit Review</button>
                </form>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 90 }}>
              <div className="flex-between mb-2">
                <div>
                  <span className="text-muted text-sm">Price</span>
                  <h2 style={{ color: 'var(--primary)' }}>{formatINR(w.price)}<span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}> /sq.ft/mo</span></h2>
                </div>
              </div>

              <form onSubmit={submitBooking}>
                <div className="form-group">
                  <label>Required Space (sq.ft)</label>
                  <input type="number" min={1} max={w.availableSpace} value={space} onChange={(e) => setSpace(Number(e.target.value))} />
                  <div className="form-hint">Available: {w.availableSpace.toLocaleString()} sq.ft · Min: {w.minimumDuration} month(s)</div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', margin: '8px 0 12px', paddingTop: 8 }}>
                  <div className="price-row"><span className="lbl">Rental Duration</span><strong>{months} month(s)</strong></div>
                  <div className="price-row"><span className="lbl">Space Rent</span><strong>{formatINR(price.spaceRent)}</strong></div>
                  <div className="price-row"><span className="lbl">Security Deposit (10%)</span><strong>{formatINR(price.deposit)}</strong></div>
                  <div className="price-row"><span className="lbl">Platform Fee (5%)</span><strong>{formatINR(price.platformFee)}</strong></div>
                  <div className="price-row total"><span className="lbl">Total Amount</span><span>{formatINR(price.totalAmount)}</span></div>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg">Request Booking</button>
                <p className="text-center text-sm text-muted mt-1">You only pay after the owner approves.</p>
              </form>
            </div>

            <div className="card mt-2">
              <h4 className="mb-2">Warehouse Owner</h4>
              <div className="flex" style={{ gap: 10, marginBottom: 10 }}>
                <span className="avatar">{initials(w.ownerId?.name)}</span>
                <div>
                  <strong className="text-sm">{w.ownerId?.name}</strong>
                  <div className="text-sm text-muted">{w.ownerId?.company}</div>
                </div>
              </div>
              <div className="text-sm text-muted" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>📞 {w.ownerId?.phone || '—'}</span>
                <span>✉️ {w.ownerId?.email || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
