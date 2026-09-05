import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/format';

export default function Sidebar({ sections, onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="side-user">
        <span className="avatar-lg">{initials(user?.name)}</span>
        <h4>{user?.name}</h4>
        <p>{user?.company || user?.email}</p>
        <span className={`role-badge role-${user?.role}`} style={{ marginTop: 6 }}>{user?.role}</span>
      </div>
      <nav className="side-nav">
        {sections.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.end}>
            <span>{s.icon}</span>
            {s.label}
            {s.count ? <span className="badge-count">{s.count}</span> : null}
          </NavLink>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          <span>🚪</span> Logout
        </a>
      </nav>
    </aside>
  );
}
