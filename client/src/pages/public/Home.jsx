import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { formatINR } from '../../utils/format';

const features = [
  { icon: '🏗️', title: 'Partial Space Rental', desc: 'Rent only the exact sq.ft you need — not an entire warehouse.' },
  { icon: '📅', title: 'Flexible Duration', desc: 'Rent by the week, month or longer. Pay only for the time you use.' },
  { icon: '🛡️', title: 'Secure Storage', desc: 'Controlled entry and exit logging to protect your inventory.' },
  { icon: '💰', title: 'Affordable Storage', desc: 'Convert unused warehouse capacity into budget-friendly storage.' },
  { icon: '💻', title: 'Easy Online Booking', desc: 'Discover, compare, price and book storage space in minutes.' },
  { icon: '📦', title: 'Inventory Management', desc: 'Track products, quantities, expiry dates and rack locations.' },
  { icon: '📝', title: 'Digital Agreements', desc: 'Generate and download rental agreements instantly, no paperwork.' },
  { icon: '⭐', title: 'Trusted Reviews', desc: 'Two-way ratings between customers and owners build trust.' },
];

export default function Home() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/warehouses/public?limit=6')
      .then(setWarehouses)
      .catch(() => setWarehouses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>Turn Empty Warehouse Space Into Opportunity</h1>
          <p className="sub">Find affordable, flexible storage space or earn from your unused warehouse capacity.</p>
          <div className="hero-cta">
            <Link to="/find" className="btn btn-white btn-lg">Find Warehouse</Link>
            <Link to="/list-warehouse" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
              List Your Space
            </Link>
          </div>
          <div className="mt-4" style={{ display: 'flex', gap: 28, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 24, marginTop: 48 }}>
            {[['10,000+', 'Sq.ft available'], ['500+', 'Warehouses'], ['1,200+', 'Businesses'], ['50+', 'Cities']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE FLOW */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Turn Unused Space Into Shared Storage</h2>
            <p>Different businesses can use different portions of one warehouse.</p>
          </div>
          <div className="flow">
            <div className="flow-node">📦 Warehouse Owner<br /><span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--muted)' }}>10,000 sq.ft · 7,000 used</span></div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">✅ 3,000 sq.ft Listed</div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">🏢 Smart Platform</div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">💼 Business A · 500 sq.ft<br /><span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--muted)' }}>Business B · 1,000 sq.ft · C · 750</span></div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section section-alt">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">The Problem</span>
            <h2>Millions of sq.ft of warehouse space sits empty every day</h2>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3 className="mb-2">🏗️ For Warehouse Owners</h3>
              <p className="text-muted">Owners across the country have partially used warehouses. The unused portion generates no income — paid-for space lies idle, dragging down utilization and return on investment.</p>
            </div>
            <div className="card">
              <h3 className="mb-2">📦 For Small Businesses</h3>
              <p className="text-muted">Startups, SMEs and e-commerce sellers need storage but are forced to rent entire warehouses at high cost — even when they only need a corner of it. Or they manage without storage entirely.</p>
            </div>
          </div>
          <div className="card mt-3 text-center">
            <h3 className="text-primary mb-2">The Result?</h3>
            <p className="text-muted">Owners lose revenue. Businesses pay too much or go without.<br /> <strong style={{ color: 'var(--navy)' }}>“Don't leave valuable warehouse space unused. Share it. Store it. Grow.”</strong></p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Key Features</span>
            <h2>Everything you need to store smarter</h2>
          </div>
          <div className="features">
            {features.map((f) => (
              <div className="card feature-card card-hover" key={f.title}>
                <div className="f-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS STEPS */}
      <section className="section section-blue">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2>From Search to Storage in 4 Steps</h2>
          </div>
          <div className="steps">
            <div className="card step-card">
              <div className="step-icon">🔍</div>
              <h3>1. Discover</h3>
              <p>Search and filter warehouses by location, space, price and facilities.</p>
            </div>
            <div className="card step-card">
              <div className="step-icon">📐</div>
              <h3>2. Select & Price</h3>
              <p>Choose your exact sq.ft and duration. The platform calculates your cost instantly.</p>
            </div>
            <div className="card step-card">
              <div className="step-icon">📋</div>
              <h3>3. Request & Book</h3>
              <p>Send a booking request. The owner approves, you pay and get a digital agreement.</p>
            </div>
            <div className="card step-card">
              <div className="step-icon">🛡️</div>
              <h3>4. Move In Securely</h3>
              <p>Get secure face-verified access, manage inventory and track everything online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h2 className="mb-3">Benefits for Businesses</h2>
              <ul style={{ listStyle: 'none' }}>
                {['Affordable storage — pay only for the space you use', 'Flexible rental durations', 'Easy warehouse discovery and comparison', 'Online booking with instant price estimates', 'Inventory tracking built-in', 'Digital agreements and controlled access'].map((b) => (
                  <li key={b} style={{ padding: '9px 0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>✔</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="mb-3">Benefits for Warehouse Owners</h2>
              <ul style={{ listStyle: 'none' }}>
                {['Earn from unused storage space', 'Increase warehouse utilization', 'Receive and manage booking requests', 'Manage available space easily', 'Track income and revenue', 'Manage customers and agreements'].map((b) => (
                  <li key={b} style={{ padding: '9px 0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✔</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WAREHOUSES */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Space</span>
            <h2>Available Warehouse Space</h2>
            <p>Rent only the portion you need.</p>
          </div>
          <div className="grid grid-3">
            {loading ? <p className="text-muted">Loading warehouses...</p>
              : warehouses.length === 0 ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div className="wh-card" key={i}>
                      <div className="wh-img" style={{ background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                        {i === 1 ? 'Warehouse A' : i === 2 ? 'Warehouse B' : 'Warehouse C'}
                      </div>
                      <div className="wh-body">
                        <div className="wh-name">{i === 1 ? 'Warehouse A - Bhiwandi Hub' : i === 2 ? 'Warehouse B - Peenya Storage' : 'Warehouse C - Cold Chamber'}</div>
                        <div className="wh-loc">📍 {i === 1 ? 'Bhiwandi, Maharashtra' : i === 2 ? 'Peenya, Bengaluru' : 'Vile Parle, Mumbai'}</div>
                        <div className="wh-meta">
                          <span className="tag tag-blue">{(i === 1 ? 3000 : i === 2 ? 2500 : 800).toLocaleString()} sq.ft avail</span>
                          <span className="tag tag-green">{i === 1 ? 'Dry Storage' : i === 2 ? 'Dry Storage' : 'Cold Storage'}</span>
                        </div>
                        <p className="wh-price"><strong>{formatINR(i === 1 ? 20 : i === 2 ? 25 : 60)}</strong><span className="text-muted text-sm">/sq.ft/month</span></p>
                        <Link to="/find" className="btn btn-soft btn-sm mt-2">View Details</Link>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                warehouses.map((w) => (
                  <div className="wh-card" key={w._id}>
                    <div className="wh-img">
                      {w.images?.[0] ? <img src={w.images[0]} alt={w.name} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>📦</div>}
                      <span className="tag wh-tag" style={{ background: '#fff', color: 'var(--primary)' }}>{w.availableSpace.toLocaleString()} sq.ft</span>
                    </div>
                    <div className="wh-body">
                      <div className="wh-name">{w.name}</div>
                      <div className="wh-loc">📍 {w.location}</div>
                      <div className="wh-meta">
                        <span className="tag tag-green">{w.storageType}</span>
                        {w.facilities?.slice(0, 2).map((f) => <span className="tag" key={f}>{f}</span>)}
                      </div>
                      <p className="wh-price"><strong>{formatINR(w.price)}</strong><span className="text-muted text-sm">/sq.ft/month</span></p>
                      <Link to={`/warehouse/${w._id}`} className="btn btn-soft btn-sm mt-2">View Details</Link>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container">
          <div className="card text-center" style={{ padding: '48px 32px', background: 'linear-gradient(135deg, var(--navy), #1e3a8a)', color: '#fff' }}>
            <h2 style={{ color: '#fff', fontSize: '2rem' }}>Why Choose Smart Warehouse?</h2>
            <p style={{ color: '#cbd5e1', margin: '16px auto 32px', maxWidth: 620 }}>
              Don't rent an entire warehouse when you only need a small space. We turn
              valuable unused warehouse capacity into affordable, flexible storage for
              growing businesses.
            </p>
            <div className="steps mt-3">
              {[['💰 📉', 'Pay only for used space'], ['🕒', 'Rent for as long as you need'], ['🛡️', 'Verified, secure warehouses'], ['🤝', 'Trusted two-way ratings']].map(([i, t]) => (
                <div key={t} style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{i}</div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section section-blue text-center">
        <div className="container">
          <h2 className="mb-2" style={{ fontSize: '1.9rem' }}>Ready to store smarter?</h2>
          <p className="text-muted mb-3" style={{ maxWidth: 520, margin: '0 auto 24px' }}>
            Whether you have unused warehouse space or a business in need of affordable storage — get started today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/list-warehouse" className="btn btn-outline btn-lg">List Your Space</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
