import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { formatINR } from '../../utils/format';

const storageTypes = ['Dry Storage', 'Cold Storage', 'Secure Vault', 'Open Yard', 'Controlled'];

export default function FindWarehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '', minSpace: '', maxPrice: '', storageType: '',
    security: '', cctv: false, parking: false, loading: false,
    electricity: false, access24: false, warehouseType: '',
  });

  const load = async (params = {}) => {
    setLoading(true);
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
    try {
      const data = await api.get(`/warehouses?${qs.toString()}`);
      setWarehouses(data);
    } catch { setWarehouses([]); }
    setLoading(false);
  };

  useEffect(() => {
    load({ location: filters.location, minSpace: filters.minSpace, maxPrice: filters.maxPrice, storageType: filters.storageType, warehouseType: filters.warehouseType });
  }, []);

  const applyFilters = () => {
    let result = warehouses;
    if (filters.cctv) result = result.filter((w) => w.facilities?.includes('CCTV') || w.security?.some((s) => s.toLowerCase().includes('cctv')));
    if (filters.parking) result = result.filter((w) => w.facilities?.includes('Parking'));
    if (filters.loading) result = result.filter((w) => w.facilities?.includes('Loading/Unloading'));
    if (filters.electricity) result = result.filter((w) => w.facilities?.includes('Electricity'));
    if (filters.access24) result = result.filter((w) => w.facilities?.includes('24/7 Access'));
    return result;
  };

  const visible = applyFilters();

  return (
    <div>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div className="container">
          <h2 className="mb-2" style={{ fontSize: '1.8rem' }}>Find Warehouse Space</h2>
          <p className="text-muted mb-3">Search warehouses and rent only the space you need.</p>
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Location</label>
                <input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="City / area" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Required Space (sq.ft)</label>
                <input type="number" value={filters.minSpace} onChange={(e) => setFilters({ ...filters, minSpace: e.target.value })} placeholder="e.g. 500" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Max Price (₹/sq.ft/month)</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="e.g. 30" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Storage Type</label>
                <select value={filters.storageType} onChange={(e) => setFilters({ ...filters, storageType: e.target.value })}>
                  <option value="">All types</option>
                  {storageTypes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => load({ location: filters.location, minSpace: filters.minSpace, maxPrice: filters.maxPrice, storageType: filters.storageType, warehouseType: filters.warehouseType })}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <p className="text-sm fw-700 mb-2" style={{ color: 'var(--charcoal)' }}>Refine by facilities</p>
              <div className="checkbox-grid">
                {[
                  ['cctv', 'CCTV'], ['parking', 'Parking'], ['loading', 'Loading/Unloading'],
                  ['electricity', 'Electricity'], ['access24', '24/7 Access'],
                ].map(([k, lbl]) => (
                  <label className="checkbox-item" key={k}>
                    <input type="checkbox" checked={filters[k]} onChange={(e) => setFilters({ ...filters, [k]: e.target.checked })} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          {loading ? (
            <p className="text-muted">Loading warehouses...</p>
          ) : visible.length === 0 ? (
            <div className="empty">
              <div className="e-icon">🔍</div>
              <p>No warehouses match your search. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {visible.map((w) => (
                <div className="wh-card" key={w._id}>
                  <div className="wh-img">
                    {w.images?.[0] ? <img src={w.images[0]} alt={w.name} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>📦</div>}
                    <span className="tag wh-tag" style={{ background: '#fff', color: 'var(--primary)' }}>{w.availableSpace.toLocaleString()} sq.ft</span>
                  </div>
                  <div className="wh-body">
                    <div className="flex-between">
                      <div className="wh-name">{w.name}</div>
                      {w.rating > 0 && <span className="stars" style={{ fontSize: '0.85rem' }}>★ {w.rating}</span>}
                    </div>
                    <div className="wh-loc">📍 {w.location}</div>
                    <div className="wh-meta">
                      <span className="tag tag-blue">{w.storageType}</span>
                      <span className="tag tag-green">{w.warehouseType}</span>
                      {w.security?.[0] && <span className="tag">🛡️ {w.security[0]}</span>}
                    </div>
                    <div className="wh-meta">
                      {w.facilities?.slice(0, 3).map((f) => <span className="tag" key={f}>✓ {f}</span>)}
                    </div>
                    <div className="flex-between">
                      <p className="wh-price" style={{ margin: 0 }}><strong>{formatINR(w.price)}</strong><span className="text-muted text-sm">/sq.ft/mo</span></p>
                      <Link to={`/warehouse/${w._id}`} className="btn btn-primary btn-sm">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
