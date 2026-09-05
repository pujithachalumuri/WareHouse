export const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export const timeAgo = (d) => {
  if (!d) return '';
  const seconds = Math.floor((new Date() - new Date(d)) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

export const calculateMonths = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e - s;
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30)));
};

export const initials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
};

export const initialsColor = (role) => {
  if (role === 'owner') return 'var(--primary)';
  if (role === 'admin') return '#7c3aed';
  return '#0891b2';
};

export const bookingPrice = (space, price, months) => {
  const spaceRent = space * price * months;
  const deposit = Math.round(spaceRent * 0.1);
  const platformFee = Math.round(spaceRent * 0.05);
  return { spaceRent, deposit, platformFee, totalAmount: spaceRent + deposit + platformFee };
};
