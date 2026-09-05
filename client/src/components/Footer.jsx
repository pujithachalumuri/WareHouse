import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>SW</span>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>
                Smart<span style={{ color: '#93c5fd' }}>Warehouse</span>
              </span>
            </div>
            <p>
              A warehouse space-sharing marketplace. Rent only the space you need,
              for only as long as you need it. Don't rent an entire warehouse when
              you only need a small space.
            </p>
            <div className="mt-3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to="/find" className="btn btn-soft btn-sm">Find Warehouse</Link>
              <Link to="/list-warehouse" className="btn btn-white btn-sm">List Your Space</Link>
            </div>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/about">About Us</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/find">Find Warehouse</Link>
            <Link to="/list-warehouse">List Your Space</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Sign In</Link>
          </div>
          <div>
            <h4>For Businesses</h4>
            <Link to="/find">Affordable Storage</Link>
            <Link to="/how-it-works">Flexible Rental</Link>
            <Link to="/how-it-works">Digital Agreements</Link>
            <Link to="/find">Rent Warehouse Space</Link>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Smart Warehouse Space Sharing Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
