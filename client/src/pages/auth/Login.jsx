import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'customer' });
  const [err, setErr] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const goToRole = (role) => setForm((f) => ({ ...f, role }));

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

        <p className="text-center mt-3 text-muted text-sm">
          Don't have an account? <Link to="/register" className="text-primary fw-700">Register</Link>
        </p>
        <p className="text-center text-sm text-muted" style={{ marginTop: 4 }}>
          Forgot password? <span className="text-primary fw-700" style={{ cursor: 'pointer' }}>Contact support</span>
        </p>
      </div>
    </div>
  );
}