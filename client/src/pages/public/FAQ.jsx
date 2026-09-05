import { useState } from 'react';

const faqs = [
  {
    q: 'Can I rent just a part of a warehouse?',
    a: 'Absolutely. That is the core idea behind Smart Warehouse. Instead of renting an entire warehouse, you can choose the exact sq.ft you need — as little as a small portion — and only pay for what you use. Find a warehouse, enter your required space and duration, and the platform handles the rest.',
  },
  {
    q: 'How is the pricing calculated?',
    a: 'Pricing is simple and transparent: Price = Space (sq.ft) × Rate (₹/sq.ft/month) × Duration (months). For example, 500 sq.ft at ₹20 per sq.ft per month for 2 months equals ₹20,000. There are no hidden charges — the estimate you see is what you pay.',
  },
  {
    q: 'How does the booking process work?',
    a: 'First, search and choose a warehouse that fits your needs. Select your required space and rental duration, then send a booking request. The owner reviews and approves your request. Once approved, you complete payment and a digital agreement is generated instantly. After that you get access to your space.',
  },
  {
    q: 'How is entry to my storage space managed?',
    a: 'Access to your storage area is controlled and event-based. Entry and exit events are logged so you can track who comes and goes, keeping your inventory safe.',
  },
  {
    q: 'Do I get a rental agreement?',
    a: 'Yes. Once your booking is approved and payment is completed, a digital rental agreement is generated automatically. It clearly outlines the space rented, duration, pricing and terms. You can download and keep it for your records — no physical paperwork required.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Payments are processed securely online through supported payment methods available on the platform. You will receive a receipt for every transaction, and your payment status is tracked throughout the booking lifecycle.',
  },
  {
    q: 'Can I get a refund if I cancel my booking?',
    a: 'Refund eligibility depends on the cancellation policy set by the owner and the stage of your booking. If you cancel before the rental period begins and within the allowed window, you may receive a full or partial refund. Check the specific warehouse policy before confirming your booking.',
  },
  {
    q: 'Can I manage my inventory online?',
    a: 'Yes. The platform includes built-in inventory management. You can track your products, quantities, expiry dates and rack locations online. This helps you stay on top of what is stored, where, and for how long.',
  },
  {
    q: 'How do warehouse owners list their space?',
    a: 'Owners create a listing with details like total sq.ft, available space, price per sq.ft, storage type, facilities and photos. After submission, our team verifies the warehouse for quality and accuracy. Once approved, the listing goes live on the platform and becomes visible to businesses searching for storage.',
  },
  {
    q: 'What fees are charged on the platform?',
    a: 'The platform may charge a small service fee, which is clearly disclosed before you confirm any booking or payment. We strive to keep fees transparent and competitive so you always know the exact cost upfront — with no surprise charges.',
  },
  {
    q: 'How do ratings and reviews work?',
    a: 'Both customers and owners can rate each other after a completed rental. These two-way ratings help build trust across the community, so you can choose partners based on verified, genuine feedback from real storage experiences.',
  },
  {
    q: 'Is my inventory insured or protected?',
    a: 'While we strongly focus on security through verification, face-based access control and secure warehouse selection, we recommend reviewing your own insurance needs. The platform and owners maintain clear agreements to define responsibility, and we always encourage transparent communication about storage conditions.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div>
      {/* HERO HEADER */}
      <section className="section" style={{ padding: '80px 0 56px', background: 'linear-gradient(135deg, var(--navy), #1e3a8a 60%, #1d4ed8)' }}>
        <div className="container">
          <div className="section-head" style={{ margin: 0, maxWidth: 720 }}>
            <span className="eyebrow">FAQ</span>
            <h2 style={{ color: '#fff', fontSize: '2.4rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
              Everything you need to know about renting, listing, pricing and managing storage space.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="section">
        <div className="container container-narrow">
          <div className="mb-4">
            {faqs.map((f, i) => (
              <div className="card mb-2" key={i} style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--navy)',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  <span>{f.q}</span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: open === i ? 'var(--primary)' : 'var(--bg-soft)',
                      color: open === i ? '#fff' : 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {open === i ? '−' : '+'}
                  </span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 24px 20px', color: 'var(--muted)', lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card text-center" style={{ background: 'var(--bg-blue)' }}>
            <h3 className="mb-2">Still have questions?</h3>
            <p className="text-muted mb-3">Our team is happy to help you with anything not covered above.</p>
            <a href="/contact" className="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
