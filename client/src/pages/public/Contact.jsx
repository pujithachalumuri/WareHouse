import { useState } from 'react';

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'support@smartwarehouse.in', sub: 'We reply within 24 hours' },
  { icon: '📞', label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 9am to 7pm IST' },
  { icon: '📍', label: 'Office', value: 'Smart Warehouse HQ', sub: 'Andheri East, Mumbai, Maharashtra 400069' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div>
      {/* HERO HEADER */}
      <section className="section" style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--navy), #1e3a8a 60%, #1d4ed8)' }}>
        <div className="container">
          <div className="section-head" style={{ margin: 0, maxWidth: 720 }}>
            <span className="eyebrow">Contact Us</span>
            <h2 style={{ color: '#fff', fontSize: '2.4rem' }}>We'd Love to Hear From You</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
              Questions about storage, listing your space, or partnerships — reach out and our team will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT BODY */}
      <section className="section">
        <div className="container">
          {/* Contact info cards */}
          <div className="grid grid-3 mb-4">
            {contactInfo.map((c) => (
              <div className="card feature-card text-center" key={c.label} style={{ textAlign: 'center' }}>
                <div className="f-icon" style={{ margin: '0 auto 16px' }}>{c.icon}</div>
                <h3>{c.label}</h3>
                <p style={{ fontWeight: 600, color: 'var(--navy)', margin: '6px 0' }}>{c.value}</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Form + info */}
          <div className="grid grid-2">
            <div className="card">
              <h3 className="mb-3">Send Us a Message</h3>
              {sent && (
                <div className="alert alert-success">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">Send Message</button>
              </form>
            </div>

            <div>
              <div className="card" style={{ background: 'linear-gradient(135deg, var(--navy), #1e3a8a)', color: '#fff' }}>
                <h3 style={{ color: '#fff' }} className="mb-3">Why Reach Out?</h3>
                <ul style={{ listStyle: 'none' }}>
                  {[
                    'Questions about renting storage space or pricing',
                    'Help with listing your warehouse and getting verified',
                    'Issues with bookings, payments or access',
                    'Partnership and business collaboration enquiries',
                    'Feedback to help us improve the platform',
                  ].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1' }}>
                      <span style={{ color: '#fff', fontWeight: 800 }}>›</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card mt-3">
                <h3 className="mb-2">⏱️ Response Time</h3>
                <p className="text-muted">
                  We aim to respond to every enquiry within <strong style={{ color: 'var(--navy)' }}>24 hours</strong> on business days.
                  For urgent issues related to active bookings or access, please use the support option inside your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
