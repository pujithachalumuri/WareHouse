import { useEffect, useState } from 'react';

export default function DBBanner() {
  const [dbOk, setDbOk] = useState(null);
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setDbOk(d.dbConfigured))
      .catch(() => setDbOk(false));
  }, []);
  if (dbOk === null || dbOk) return null;
  return (
    <div className="db-banner">
      Database not connected. Configure MONGO_URI in server/.env (see .env.example) and run
      <code style={{ fontWeight: 800, margin: '0 4px' }}>npm run seed</code>
      to load demo data. You can still browse the demo interface.
    </div>
  );
}
