import { useState } from 'react';

const customerSteps = [
  { icon: '🔍', title: 'Search', desc: 'Browse verified warehouses by location, space, price and facilities.' },
  { icon: '👀', title: 'View Details', desc: 'Review photos, amenities, availability and owner ratings before deciding.' },
  { icon: '📐', title: 'Select Space & Duration', desc: 'Choose the exact sq.ft you need and how long you want to store.' },
  { icon: '🧮', title: 'Calculate Price', desc: 'Get an instant, transparent cost estimate based on space and duration.' },
  { icon: '📨', title: 'Send Request', desc: 'Submit a booking request to the warehouse owner with your details.' },
  { icon: '✅', title: 'Owner Approves', desc: 'The owner reviews and approves your request, confirming availability.' },
  { icon: '💳', title: 'Pay Securely', desc: 'Complete payment online through secure, supported payment methods.' },
  { icon: '📝', title: 'Digital Agreement', desc: 'An auto-generated rental agreement is created instantly — no paperwork.' },
  { icon: '🔓', title: 'Access', desc: 'Start storing in your dedicated space right away.' },
  { icon: '📦', title: 'Manage Inventory', desc: 'Track products, quantities, expiry dates and rack locations online.' },
  { icon: '🏁', title: 'Complete & Rate', desc: 'Finish your rental, release the space and rate your experience.' },
];

const ownerSteps = [
  { icon: '📋', title: 'List Your Space', desc: 'Create a listing with total sq.ft, available space, price and facilities.' },
  { icon: '➕', title: 'Add Warehouse Details', desc: 'Upload photos, location, storage type and access information for your space.' },
  { icon: '🛡️', title: 'Admin Verification', desc: 'Our team verifies your warehouse to ensure quality, safety and accuracy.' },
  { icon: '🚀', title: 'Publish Live', desc: 'Once approved, your listing goes live and becomes searchable by businesses.' },
  { icon: '📩', title: 'Receive Requests', desc: 'Get notified when a business sends a booking request for your space.' },
  { icon: '👍', title: 'Approve Bookings', desc: 'Review each request and approve, negotiate or decline based on your preference.' },
  { icon: '🛠️', title: 'Manage Rentals', desc: 'Oversee current bookings, track occupancy and manage your available space.' },
  { icon: '💰', title: 'Earn Revenue', desc: 'Receive payments for rented space and grow income from unused capacity.' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('customer');

  return (
    <div>
      {/* HERO HEADER */}
      <section className="section" style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--navy), #1e3a8a 60%, #1d4ed8)' }}>
        <div className="container">
          <div className="section-head" style={{ margin: 0, maxWidth: 720 }}>
            <span className="eyebrow">How It Works</span>
            <h2 style={{ color: '#fff', fontSize: '2.4rem' }}>Simple Steps to Store or Earn</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
              Whether you need storage or have space to share, getting started takes just a few minutes.
            </p>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="section">
        <div className="container container-narrow">
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
            <button
              className="btn btn-lg"
              style={tab === 'customer'
                ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow)' }
                : { background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)' }}
              onClick={() => setTab('customer')}
            >
              📦 For Businesses
            </button>
            <button
              className="btn btn-lg"
              style={tab === 'owner'
                ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow)' }
                : { background: 'transparent', color: 'var(--muted)', border: '2px solid var(--border)' }}
              onClick={() => setTab('owner')}
            >
              🏗️ For Warehouse Owners
            </button>
          </div>

          <div className="section-head">
            <span className="eyebrow">
              {tab === 'customer' ? 'Businesses (Customers)' : 'Warehouse Owners'}
            </span>
            <h2>{tab === 'customer' ? 'Your Path to Storage' : 'Your Path to Income'}</h2>
            <p>
              {tab === 'customer'
                ? 'Follow these steps to find, book and manage affordable storage space.'
                : 'Follow these steps to list your space and start earning from unused capacity.'}
            </p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section section-alt" style={{ paddingTop: 0 }}>
        <div className="container">
          {tab === 'customer' ? (
            <div className="steps">
              {customerSteps.map((s, i) => (
                <div className="card step-card card-hover" key={s.title}>
                  <div className="step-icon">{s.icon}</div>
                  <h3>{i + 1}. {s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="steps">
              {ownerSteps.map((s, i) => (
                <div className="card step-card card-hover" key={s.title}>
                  <div className="step-icon">{s.icon}</div>
                  <h3>{i + 1}. {s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRICING EXAMPLE CALLOUT */}
      <section className="section section-blue">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">Pricing Example</span>
            <h2>See How Pricing Works</h2>
            <p>Your cost is calculated simply and transparently — space × rate × duration.</p>
          </div>
          <div className="card text-center" style={{ maxWidth: 520, margin: '0 auto', padding: '32px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🧮</div>
            <h3 className="mb-3">Sample Calculation</h3>
            <div className="price-row">
              <span className="lbl">Space</span><span>500 sq.ft</span>
            </div>
            <div className="price-row">
              <span className="lbl">Rate</span><span>₹20 / sq.ft / month</span>
            </div>
            <div className="price-row">
              <span className="lbl">Duration</span><span>2 months</span>
            </div>
            <div className="price-row total">
              <span>Total</span><span>₹20,000</span>
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
              Formula: 500 sq.ft × ₹20 × 2 months = ₹20,000
            </p>
          </div>
        </div>
      </section>

      {/* EXTRAS */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="f-icon">⚡</div>
              <h3>Instant Estimates</h3>
              <p>Get a live price as soon as you pick your space and duration — no waiting, no calls.</p>
            </div>
            <div className="card feature-card">
              <div className="f-icon">🛡️</div>
              <h3>Verified & Secure</h3>
              <p>Every warehouse is admin-verified and access is controlled with face verification.</p>
            </div>
            <div className="card feature-card">
              <div className="f-icon">🤝</div>
              <h3>Fair for Everyone</h3>
              <p>Transparent pricing, two-way ratings and digital agreements protect both parties.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
