import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { showToast } from '../../components/Toast';
import { formatINR, formatDate, formatDateTime } from '../../utils/format';

export default function BookingDetails() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(setBooking).catch(() => setBooking(null)).finally(() => setLoading(false));
  }, [id]);

  const pay = async () => {
    try {
      await api.post(`/bookings/${id}/pay`, { amount: booking.totalAmount });
      showToast('Payment completed (simulated)');
      const b = await api.get(`/bookings/${id}`);
      setBooking(b);
    } catch (e) { showToast(e.message, 'error'); }
  };

  const cancel = async () => {
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
      showToast('Booking cancelled');
      const b = await api.get(`/bookings/${id}`);
      setBooking(b);
    } catch (e) { showToast(e.message, 'error'); }
  };

  if (loading) return <div className="section container"><p>Loading...</p></div>;
  if (!booking) return <div className="section container"><div className="empty"><p>Booking not found.</p><Link to="/my-bookings" className="btn btn-primary btn-sm mt-2">Back</Link></div></div>;

  const isCustomer = booking.customerId?._id === user?._id;
  const isOwner = booking.ownerId?._id === user?._id;

  return (
    <div className="dash-main" style={{ padding: '32px' }}>
      <div className="dash-content">
        <Link to={isCustomer ? '/my-bookings' : '/booking-requests'} className="text-primary text-sm fw-700">← Back</Link>
        <div className="flex-between mt-2">
          <h2 className="page-title">{booking.warehouseId?.name} — Booking</h2>
          <span className={`status status-${booking.status}`}>{booking.status}</span>
        </div>

        <div className="grid mt-3" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
          <div className="card">
            <h3 className="mb-3">Booking Summary</h3>
            <div className="price-row"><span className="lbl">Warehouse</span><strong>{booking.warehouseId?.name}</strong></div>
            <div className="price-row"><span className="lbl">Location</span><span>{booking.warehouseId?.location}</span></div>
            <div className="price-row"><span className="lbl">Space Rented</span><strong>{booking.spaceRequired?.toLocaleString()} sq.ft</strong></div>
            <div className="price-row"><span className="lbl">Rental Period</span><span>{formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span></div>
            <div className="price-row"><span className="lbl">Space Rent</span><strong>{formatINR(booking.spaceRent)}</strong></div>
            <div className="price-row"><span className="lbl">Security Deposit</span><strong>{formatINR(booking.deposit)}</strong></div>
            <div className="price-row"><span className="lbl">Platform Fee</span><strong>{formatINR(booking.platformFee)}</strong></div>
            <div className="price-row total"><span className="lbl">Total</span><span>{formatINR(booking.totalAmount)}</span></div>
          </div>

          <div>
            <div className="card">
              <h3 className="mb-2">Parties</h3>
              <p className="text-muted text-sm" style={{ marginTop: 4 }}>Customer</p>
              <strong>{booking.customerId?.name}</strong>
              <p className="text-sm text-muted">{booking.customerId?.company} · {booking.customerId?.phone}</p>
              <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
              <p className="text-muted text-sm">Warehouse Owner</p>
              <strong>{booking.ownerId?.name}</strong>
              <p className="text-sm text-muted">{booking.ownerId?.company} · {booking.ownerId?.phone}</p>
            </div>

            <div className="card mt-2">
              <div className="flex-between mb-2">
                <span className="text-muted text-sm">Payment Status</span>
                <span className={`status ${booking.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>{booking.paymentStatus}</span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-muted text-sm">Agreement</span>
                <span className={`status ${booking.agreementGenerated ? 'status-verified' : 'status-pending'}`}>{booking.agreementGenerated ? 'Generated' : 'Pending'}</span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-muted text-sm">Booked on</span>
                <span className="text-sm">{formatDateTime(booking.createdAt)}</span>
              </div>
            </div>

            {isCustomer && booking.status === 'approved' && booking.paymentStatus !== 'paid' && (
              <div className="card mt-2">
                <h4 className="mb-2">Complete Payment</h4>
                <p className="text-sm text-muted mb-2">Pay {formatINR(booking.totalAmount)} to activate your booking.</p>
                <button className="btn btn-success btn-block" onClick={pay}>Pay {formatINR(booking.totalAmount)}</button>
              </div>
            )}
            {isCustomer && (booking.status === 'pending' || booking.status === 'approved' || booking.status === 'active') && (
              <button className="btn btn-danger btn-block mt-2" onClick={cancel}>Cancel Booking</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
