const stats = [
  { value: '10,000+', label: 'Sq.ft of space shared' },
  { value: '500+', label: 'Warehouses onboard' },
  { value: '1,200+', label: 'Businesses served' },
  { value: '50+', label: 'Cities across India' },
];

const values = [
  { icon: '🤝', title: 'Trust First', desc: 'Every warehouse, owner and customer is verified. Face-verified access and two-way ratings keep the community accountable.' },
  { icon: '💡', title: 'Smart Utilization', desc: 'We believe no square foot should sit idle. Matching unused capacity with real need is what we do every day.' },
  { icon: '💰', title: 'Fair & Transparent', desc: 'Clear pricing, honest calculations and no hidden charges. You always know exactly what you pay for.' },
  { icon: '📦', title: 'Customer-Focused', desc: 'From flexible durations to easy inventory tracking, every feature is built around how businesses actually store goods.' },
  { icon: '🛡️', title: 'Security & Safety', desc: 'Access control, verification and insurance-grade practices keep your inventory safe and secure at all times.' },
  { icon: '🚀', title: 'Growth Together', desc: 'As our businesses grow, so does the ecosystem. Shared space means shared opportunity across the network.' },
];

export default function About() {
  return (
    <div>
      {/* HERO HEADER */}
      <section className="section" style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--navy), #1e3a8a 60%, #1d4ed8)' }}>
        <div className="container">
          <div className="section-head" style={{ margin: 0, maxWidth: 720 }}>
            <span className="eyebrow">About Us</span>
            <h2 style={{ color: '#fff', fontSize: '2.4rem' }}>Sharing Space, Growing Business</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
              We're on a mission to unlock the value of unused warehouse capacity across India —
              connecting owners with businesses that need affordable, flexible storage.
            </p>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="section">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">Our Mission</span>
            <h2>Every Square Foot, Put to Work</h2>
            <p>
              Across the country, warehouses sit partially empty while thousands of businesses
              struggle to find affordable space to store their goods. We built a smarter way —
              a platform where unused warehouse capacity becomes a shared, flexible asset.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3 className="mb-2" style={{ color: 'var(--primary)' }}>For Businesses</h3>
              <p className="text-muted">
                Rent only the exact sq.ft you need, for as long as you need it. No more paying
                for an entire warehouse you'll never fill. Just affordable, flexible storage
                that scales with your business.
              </p>
            </div>
            <div className="card">
              <h3 className="mb-2" style={{ color: 'var(--primary)' }}>For Owners</h3>
              <p className="text-muted">
                Turn idle warehouse space into steady income. List your available capacity,
                receive booking requests online and grow your utilization without any extra
                operational headache.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section section-alt">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2>The Unused-Space-Sharing Concept</h2>
            <p>Think of it as co-working — but for warehouses.</p>
          </div>
          <div className="card mb-3">
            <p>
              Traditionally, businesses had to rent an entire warehouse even if they only needed a
              corner of it. Owners, meanwhile, watched their paid-for space sit empty and unprofitable.
              Our platform changes that equation entirely.
            </p>
          </div>
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="f-icon">🏗️</div>
              <h3>Owners List Capacity</h3>
              <p>Warehouse owners publish their available sq.ft, price and facilities on the platform.</p>
            </div>
            <div className="card feature-card">
              <div className="f-icon">🔍</div>
              <h3>Businesses Find Space</h3>
              <p>Businesses search, compare and book just the portion they need — no more, no less.</p>
            </div>
            <div className="card feature-card">
              <div className="f-icon">🤖</div>
              <h3>The Platform Connects</h3>
              <p>Smart matching, instant pricing and digital agreements bring it all together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLE & STATS */}
      <section className="section section-blue">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The Impact</span>
            <h2>Small Spaces, Big Results</h2>
          </div>
          <div className="grid grid-2 mb-4">
            <div className="card">
              <h3 className="mb-2">A Real-World Example</h3>
              <p className="text-muted mb-3">
                An owner has a 10,000 sq.ft warehouse using only 6,000 sq.ft. Instead of letting
                4,000 sq.ft sit idle, they list it at ₹20/sq.ft/month. In one month they earn
                <strong style={{ color: 'var(--navy)' }}> ₹80,000</strong> from space that was
                previously earning nothing.
              </p>
              <div className="price-row">
                <span className="lbl">Total listed space</span><span>4,000 sq.ft</span>
              </div>
              <div className="price-row">
                <span className="lbl">Price per sq.ft / month</span><span>₹20</span>
              </div>
              <div className="price-row total">
                <span>Monthly income from idle space</span><span>₹80,000</span>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 className="mb-3">Our Numbers</h3>
              <div className="stat-grid">
                {stats.map((s) => (
                  <div className="stat-card" key={s.label}>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{s.value}</div>
                    <div className="stat-sub">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
                Growing every day as more businesses and owners join the sharing economy for storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our Values</span>
            <h2>What Drives Everything We Do</h2>
            <p>The principles that shape how we build, operate and grow Smart Warehouse.</p>
          </div>
          <div className="features">
            {values.map((v) => (
              <div className="card feature-card card-hover" key={v.title}>
                <div className="f-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
