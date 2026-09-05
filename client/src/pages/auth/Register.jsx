import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../components/Toast';
import FaceCapture from '../../components/FaceCapture';

const checkPassword = (p) => ({
  length: p.length >= 6,
  upper: /[A-Z]/.test(p),
  lower: /[a-z]/.test(p),
  digit: /\d/.test(p),
  special: /[^A-Za-z0-9]/.test(p),
});

const phoneError = (phone) => {
  const cleaned = String(phone || '').replace(/[\s-]/g, '').replace(/^\+/, '').replace(/^91/, '');
  if (!cleaned) return '';
  if (!/^\d{10}$/.test(cleaned)) return 'Enter exactly 10 digits only (numbers).';
  if (!/^[6789]/.test(cleaned)) return 'Number must start with 6, 7, 8 or 9.';
  return '';
};

function suggestStrong() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const specials = '!@#$%^&*_-+=?';
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  let pw = pick(upper) + pick(lower) + pick(digits) + pick(specials);
  const all = upper + lower + digits + specials;
  while (pw.length < 12) pw += pick(all);
  return pw.split('').sort(() => Math.random() - 0.5).join('');
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer', faceImage: '' });
  const [err, setErr] = useState('');
  const [showPw, setShowPw] = useState(false);

  const pwChecks = checkPassword(form.password);
  const pwScore = Object.values(pwChecks).filter(Boolean).length;
  const pwStrength = pwScore <= 2 ? 'Weak' : pwScore <= 4 ? 'Medium' : 'Strong';
  const pwStrengthColor = pwScore <= 2 ? 'var(--danger)' : pwScore <= 4 ? 'var(--warning)' : 'var(--success)';
  const pErr = phoneError(form.phone);
  const pwBad = !pwChecks.length || !pwChecks.upper || !pwChecks.lower || !pwChecks.digit || !pwChecks.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirmPassword) { setErr('Passwords do not match'); return; }
    if (pwBad) { setErr('Fix the red password errors below (min 6 chars with upper, lower, number and special character).'); return; }
    if (pErr) { setErr(pErr); return; }
    if (!form.faceImage) { setErr('Please capture or upload a photo of your face. It is required for secure login.'); return; }
    const res = await register(form);
    if (res.success) {
      showToast('Account created successfully!');
      navigate(res.user.role === 'owner' ? '/owner-dashboard' : '/dashboard');
    } else {
      setErr(res.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="text-center mb-2">Create your account</h2>
        <p className="auth-sub text-muted">Join the warehouse space-sharing platform</p>
        {err && <div className="alert alert-error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="role-tabs">
              <button type="button" onClick={() => setForm({ ...form, role: 'customer' })} className={`role-tab ${form.role === 'customer' ? 'active customer' : ''}`}>
                <span className="role-icon">👤</span>
                <span><strong>Customer</strong><small>Book &amp; use warehouse space</small></span>
              </button>
              <button type="button" onClick={() => setForm({ ...form, role: 'owner' })} className={`role-tab ${form.role === 'owner' ? 'active owner' : ''}`}>
                <span className="role-icon">🏭</span>
                <span><strong>Warehouse Owner</strong><small>List &amp; rent out space</small></span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number <span className="text-muted">(India)</span></label>
            <div className={`phone-input-group ${form.phone && pErr ? 'input-error' : ''}`}>
              <span className="phone-code">🇮🇳 +91</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number (e.g. 98765 43210)"
                maxLength={20}
              />
            </div>
            {pErr && form.phone ? (
              <div className="field-error"><span className="field-error-icon">⚠️</span>{pErr}</div>
            ) : !pErr && form.phone ? (
              <div className="field-success">✓ Valid mobile number</div>
            ) : null}
            <p className="form-hint">Country code +91 (India). Enter exactly 10 digits starting with 6, 7, 8 or 9.</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-input">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={form.password && pwBad ? 'input-error' : ''}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: `${(pwScore / 5) * 100}%`, background: pwStrengthColor }} />
                  </div>
                  <span className="text-sm" style={{ color: pwStrengthColor }}>{pwStrength} ({pwScore}/5)</span>
                </div>
              )}
              {form.password && !pwChecks.length && <div className="field-error"><span className="field-error-icon">⚠️</span>Password must be at least 6 characters</div>}
              {form.password && !pwChecks.upper && <div className="field-error"><span className="field-error-icon">⚠️</span>Add at least one uppercase letter (A-Z)</div>}
              {form.password && !pwChecks.lower && <div className="field-error"><span className="field-error-icon">⚠️</span>Add at least one lowercase letter (a-z)</div>}
              {form.password && !pwChecks.digit && <div className="field-error"><span className="field-error-icon">⚠️</span>Add at least one number (0-9)</div>}
              {form.password && !pwChecks.special && <div className="field-error"><span className="field-error-icon">⚠️</span>Add at least one special character (!@#$...)</div>}
              {form.password && pwScore === 5 && (
                <div className="field-success">✓ Strong password</div>
              )}
              {form.password && (
                <button type="button" className="btn btn-link btn-sm" onClick={() => { const s = suggestStrong(); setForm({ ...form, password: s, confirmPassword: s }); }}>✨ Suggest a strong password</button>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required />
            </div>
          </div>

          <div className="form-group">
            <FaceCapture label="Face verification photo" value={form.faceImage} onChange={(v) => setForm({ ...form, faceImage: v })} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-2">Create Account</button>
        </form>
        <p className="text-center mt-3 text-muted text-sm">Already have an account? <Link to="/login" className="text-primary fw-700">Sign in</Link></p>
      </div>
    </div>
  );
}
