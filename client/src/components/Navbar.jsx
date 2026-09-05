import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/format';
import NotificationBell from './NotificationBell';

const brand = (
  <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>SW</span>
    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy)' }}>
      Smart<span style={{ color: 'var(--primary)' }}>Warehouse</span>
    </span>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    // Owners have their own "My Warehouses" page; find/search is for customers
    ...(user?.role !== 'owner' ? [{ to: '/find', label: 'Find Warehouse' }] : []),
    { to: '/how-it-works', label: 'How It Works' },
    // Owners & guests can list space; customers cannot
    ...(user?.role !== 'customer' ? [{ to: '/list-warehouse', label: 'List Your Space' }] : []),
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ];

  const dashboardPath = user?.role === 'owner' ? '/owner-dashboard' : '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {brand}
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
        <nav className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {links.slice(0, 4).map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => ({
              padding: '8px 12px', borderRadius: 8, fontWeight: 600, fontSize: '0.92rem',
              color: isActive ? 'var(--primary)' : 'var(--charcoal)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
            })}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <NotificationBell />
              <Link to={dashboardPath} className="btn btn-soft btn-sm">Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setOpen(!open)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span className="avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>{initials(user.name)}</span>
                </button>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ padding: '10px', fontWeight: 600 }}>{l.label}</Link>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12 }}>
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="btn btn-soft btn-sm" style={{ marginRight: 8 }}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="btn btn-ghost btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm" style={{ marginRight: 8 }}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
