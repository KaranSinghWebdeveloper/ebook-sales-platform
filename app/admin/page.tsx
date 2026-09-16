'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Palette,
  Percent,
  Wallet,
  BookOpen,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'theme' | 'commission' | 'withdrawals' | 'products'>('theme');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [theme, setTheme] = useState({
    primaryColor: '#6C47FF',
    secondaryColor: '#FF6B6B',
    accentColor: '#00D4AA',
    bgDark: '#0A0A12',
    bgSurface: '#13131F',
    borderRadius: '14px',
    siteName: 'DigiVault',
    tagline: 'Direct E-Books & Knowledge Products Marketplace',
  });

  const [commission, setCommission] = useState({
    platformPercent: 15,
    sellerPercent: 85,
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filterSeller, setFilterSeller] = useState<string>('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadData = async () => {
    try {
      const [themeRes, commRes, withRes, prodRes] = await Promise.all([
        fetch('/api/admin/theme'),
        fetch('/api/admin/commissions'),
        fetch('/api/admin/withdrawals'),
        fetch('/api/admin/products'),
      ]);

      const themeData = await themeRes.json();
      const commData = await commRes.json();
      const withData = await withRes.json();
      const prodData = await prodRes.json();

      if (themeData.primaryColor) setTheme(themeData);
      if (commData.platformPercent) setCommission(commData);
      if (withData.withdrawals) setWithdrawals(withData.withdrawals);
      if (prodData.products) setProducts(prodData.products);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        showToast('Dynamic theme saved & applied platform-wide!');
        document.documentElement.style.setProperty('--brand-primary', theme.primaryColor);
        document.documentElement.style.setProperty('--brand-secondary', theme.secondaryColor);
        document.documentElement.style.setProperty('--brand-accent', theme.accentColor);
        document.documentElement.style.setProperty('--bg-dark', theme.bgDark);
        document.documentElement.style.setProperty('--bg-surface', theme.bgSurface);
        document.documentElement.style.setProperty('--border-radius', theme.borderRadius);
      } else {
        showToast('Failed to save theme');
      }
    } catch {
      showToast('Network error saving theme');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/commissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commission),
      });
      if (res.ok) {
        showToast(`Commission updated: ${commission.sellerPercent}% to Seller, ${commission.platformPercent}% to Platform`);
      } else {
        showToast('Failed to update commission');
      }
    } catch {
      showToast('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleWithdrawalAction = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Withdrawal marked as ${status}`);
        loadData();
      }
    } catch {
      showToast('Error updating withdrawal');
    }
  };

  const handleProductStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Product status updated to ${status}`);
        loadData();
      }
    } catch {
      showToast('Error updating product status');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--brand-accent)',
          color: '#0A0A12',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999,
        }}>
          {toastMessage}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            <ShieldCheck size={13} />
            Master System Administration
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Super Admin Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Configure live dynamic themes, commission split rates, seller payouts, and catalog moderation.
          </p>
        </div>

        <button onClick={loadData} className="btn btn-sm btn-secondary">
          <RefreshCw size={15} /> Refresh System
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('theme')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            color: activeTab === 'theme' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'theme' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Palette size={18} />
          Dynamic Theme & Brand
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            color: activeTab === 'commission' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'commission' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Percent size={18} />
          Commission Split Rates
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            color: activeTab === 'withdrawals' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'withdrawals' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Wallet size={18} />
          Seller Withdrawals ({withdrawals.filter((w) => w.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            color: activeTab === 'products' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            borderBottom: activeTab === 'products' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <BookOpen size={18} />
          Catalog Moderation ({products.length})
        </button>
      </div>

      {activeTab === 'theme' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
          <form onSubmit={handleSaveTheme} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Dynamic Brand Customizer
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Change the platform's color palette, store name, and border curves live without restarting or redeploying.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Platform Site Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={theme.siteName}
                  onChange={(e) => setTheme({ ...theme, siteName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Border Radius Curve</label>
                <select
                  className="form-select"
                  value={theme.borderRadius}
                  onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                >
                  <option value="8px">Compact (8px)</option>
                  <option value="14px">Modern Balanced (14px)</option>
                  <option value="20px">Curved Sleek (20px)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Hero Tagline</label>
              <input
                type="text"
                className="form-input"
                value={theme.tagline}
                onChange={(e) => setTheme({ ...theme, tagline: e.target.value })}
              />
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Color Token Palette
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label className="form-label">Primary Brand</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    style={{ width: '42px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{theme.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="form-label">Secondary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    style={{ width: '42px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{theme.secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="form-label">Accent / Money</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                    style={{ width: '42px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{theme.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="form-label">Dark Background</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={theme.bgDark}
                    onChange={(e) => setTheme({ ...theme, bgDark: e.target.value })}
                    style={{ width: '42px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{theme.bgDark}</span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save & Apply Dynamic Colors
            </button>
          </form>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Live Theme Preview
            </h3>
            <div style={{
              background: theme.bgDark,
              border: `1px solid ${theme.primaryColor}44`,
              borderRadius: theme.borderRadius,
              padding: '1.5rem',
              boxShadow: `0 12px 30px ${theme.primaryColor}22`,
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                {theme.siteName}
              </div>
              <div style={{ fontSize: '0.82rem', color: theme.accentColor, fontWeight: 600, marginBottom: '1rem' }}>
                {theme.tagline}
              </div>

              <div style={{
                background: theme.bgSurface,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.25rem' }}>Sample Product Card</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: theme.accentColor }}>₹499</div>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: theme.borderRadius,
                  background: `linear-gradient(135deg, ${theme.primaryColor}, #8E54E9)`,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Sample Action Button
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commission' && (
        <div style={{ maxWidth: '640px' }}>
          <form onSubmit={handleSaveCommission} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Platform Revenue Split Policy
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Define how every customer payment on Razorpay is partitioned between the seller's wallet and your platform treasury.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Seller Revenue Share:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
                  {commission.sellerPercent}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={commission.sellerPercent}
                onChange={(e) => {
                  const s = parseInt(e.target.value, 10);
                  setCommission({ sellerPercent: s, platformPercent: 100 - s });
                }}
                style={{ width: '100%', accentColor: 'var(--brand-accent)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Platform Maintenance Cut:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {commission.platformPercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={commission.platformPercent}
                onChange={(e) => {
                  const p = parseInt(e.target.value, 10);
                  setCommission({ platformPercent: p, sellerPercent: 100 - p });
                }}
                style={{ width: '100%', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Live Example Calculation: ₹1,000 Sale
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Seller's Wallet Credit:</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>
                  +₹{((1000 * commission.sellerPercent) / 100).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Commission:</span>
                <span style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>
                  +₹{((1000 * commission.platformPercent) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Split Configuration
            </button>
          </form>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Seller Payout Transfers
          </h2>
          {withdrawals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No withdrawal requests in queue.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Seller</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Method & Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{w.seller?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w.seller?.email}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
                        ₹{w.amount}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{w.method}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {w.accountDetails}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={
                          w.status === 'COMPLETED' ? 'badge badge-success' :
                          w.status === 'PENDING' ? 'badge badge-warning' : 'badge badge-danger'
                        }>
                          {w.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {w.status === 'PENDING' && (
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleWithdrawalAction(w.id, 'COMPLETED')}
                              className="btn btn-sm btn-accent"
                            >
                              <CheckCircle2 size={14} /> Approve & Paid
                            </button>
                            <button
                              onClick={() => handleWithdrawalAction(w.id, 'REJECTED')}
                              className="btn btn-sm btn-secondary"
                              style={{ color: '#FF6B6B' }}
                            >
                              <XCircle size={14} /> Reject & Refund
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              System-Wide Products & Moderation
            </h2>
            <select 
              className="form-select" 
              style={{ width: 'auto', minWidth: '200px' }}
              value={filterSeller}
              onChange={(e) => setFilterSeller(e.target.value)}
            >
              <option value="ALL">All Sellers</option>
              {Array.from(new Set(products.map(p => p.sellerId))).map(sellerId => {
                const p = products.find(prod => prod.sellerId === sellerId);
                return <option key={sellerId} value={sellerId}>{p?.seller?.storeName || p?.seller?.name}</option>;
              })}
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Author</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Sales</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => filterSeller === 'ALL' || p.sellerId === filterSeller).map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        style={{ width: '38px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.category}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{p.seller?.storeName || p.seller?.name}</td>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>₹{p.price}</td>
                    <td style={{ padding: '1rem' }}>{p.totalSales} copies</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={p.status === 'APPROVED' ? 'badge badge-success' : 'badge badge-warning'}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {p.status !== 'APPROVED' ? (
                        <button
                          onClick={() => handleProductStatus(p.id, 'APPROVED')}
                          className="btn btn-sm btn-accent"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProductStatus(p.id, 'REJECTED')}
                          className="btn btn-sm btn-secondary"
                          style={{ color: '#FF6B6B' }}
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}