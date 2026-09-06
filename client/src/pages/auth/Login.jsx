import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch (e) {
    return {};
  }
};

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('choose'); // 'choose' | 'email'
  const [form, setForm] = useState({ email: '', password: '', role: 'customer' });
  const [err, setErr] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);
  const googleReady = useRef(false);
  const gConfigured = !!GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!gConfigured) return;
    if (window.google && window.google.accounts) {
      googleReady.current = true;
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => { googleReady.current = true; };
    document.body.appendChild(s);
  }, [gConfigured]);

  const goToRole = (role) => setForm((f) => ({ ...f, role }));

  const handleCredential = async (response) => {
    setGBusy(true);
    try {
      const payload = decodeJwtPayload(response.credential);
      const res = await googleLogin(response.credential, form.role, payload.name, payload.email);
      if (res.success) {
        showToast(`Welcome, ${res.user.name}!`);
        navigate(res.user.role === 'owner' ? '/owner-dashboard' : '/dashboard');
      } else {
        setErr(res.message);
      }
    } catch (e) {
      setErr('Google sign-in failed. Please try again.');
    } finally {
      setGBusy(false);
    }
  };

  const clickGoogle = () => {
    setErr('');
    if (!gConfigured) {
      showToast('Google sign-in is not configured yet. Please log in with email.', 'error');
      return;
    }
    if (!window.google || !googleReady.current) {
      showToast('Google sign-in is still loading. Please try again.', 'error');
      return;
    }
    window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredential });
    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const res = await login(form.email, form.password, form.role);
    setBusy(false);
    if (res.success) {
      showToast('Welcome back!');
      navigate(res.user.role === 'owner' ? '/owner-dashboard' : '/dashboard');
    } else {
      setErr(res.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="text-center mb-2">Welcome back</h2>
        <p className="auth-sub text-muted">Sign in to your account</p>

        <div className="form-group">
          <label className="form-label">I am a</label>
          <div className="role-tabs">
            <button type="button" onClick={() => goToRole('customer')} className={`role-tab ${form.role === 'customer' ? 'active customer' : ''}`}>
              <span className="role-icon">👤</span>
              <span><strong>Customer</strong><small>I need storage space</small></span>
            </button>
            <button type="button" onClick={() => goToRole('owner')} className={`role-tab ${form.role === 'owner' ? 'active owner' : ''}`}>
              <span className="role-icon">🏭</span>
              <span><strong>Warehouse Owner</strong><small>I rent out space</small></span>
            </button>
          </div>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        {mode === 'choose' ? (
          <>
            <button
              type="button"
              className="btn btn-outline btn-block btn-lg social-btn"
              onClick={clickGoogle}
              disabled={gBusy}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
              </svg>
              {gBusy ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="btn btn-dark btn-block btn-lg" onClick={() => { setErr(''); setMode('email'); }}>
              ✉️ Continue with Email
            </button>

            <p className="text-center mt-3 text-muted text-sm">
              Don't have an account? <Link to="/register" className="text-primary fw-700">Register</Link>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="pw-input">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy}>
                {busy ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider"><span>or</span></div>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => { setErr(''); setMode('choose'); }}>
              ← Back to all sign-in options
            </button>

            <p className="text-center mt-3 text-muted text-sm">
              Don't have an account? <Link to="/register" className="text-primary fw-700">Register</Link>
            </p>
            <p className="text-center text-sm text-muted" style={{ marginTop: 4 }}>
              Forgot password? <span className="text-primary fw-700" style={{ cursor: 'pointer' }}>Contact support</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}