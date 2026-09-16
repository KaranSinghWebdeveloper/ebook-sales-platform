'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  Wallet,
  TrendingUp,
  BookOpen,
  DollarSign,
  Plus,
  ExternalLink,
  Percent,
} from 'lucide-react';
import { UploadModal } from '@/components/dashboard/UploadModal';
import { ShareLinkModal } from '@/components/dashboard/ShareLinkModal';
import { WithdrawModal } from '@/components/dashboard/WithdrawModal';

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showUpload, setShowUpload] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedProductForShare, setSelectedProductForShare] = useState<any | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, earnRes] = await Promise.all([
        fetch('/api/seller/products'),
        fetch('/api/seller/earnings'),
      ]);

      const prodData = await prodRes.json();
      const earnData = await earnRes.json();

      if (prodRes.status === 401 || earnRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (prodData.products) setProducts(prodData.products);
      if (earnData) setEarnings(earnData);
    } catch (err) {
      console.error('Failed to load seller dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalSalesCount = products.reduce((acc, p) => acc + (p.totalSales || 0), 0);
  const totalRevenue = products.reduce((acc, p) => acc + (p.totalRevenue || 0), 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '0.4rem' }}>Creator Control Room</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Seller Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage your digital assets, monitor live sales, generate marketing campaign links, and withdraw earnings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowUpload(true)} className="btn btn-primary">
            <Plus size={18} />
            Upload New E-Book
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '4px solid var(--brand-accent)',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Percent size={20} color="var(--brand-accent)" />
          <span style={{ fontSize: '0.92rem' }}>
            Current Platform Payout Rate:{' '}
            <strong style={{ color: 'var(--brand-accent)' }}>
              {earnings?.sellerPercent || 85}% Seller Share
            </strong>{' '}
            (Platform Fee: {earnings?.platformPercent || 15}%)
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          *Automatically calculated and split on every verified Razorpay checkout
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        <div className="glass-panel glow-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Wallet</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(0, 212, 170, 0.15)' }}>
              <Wallet size={20} color="var(--brand-accent)" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-accent)', marginBottom: '1rem' }}>
            ₹{(earnings?.walletBalance || 0).toFixed(2)}
          </div>
          <button
            onClick={() => setShowWithdraw(true)}
            disabled={(earnings?.walletBalance || 0) < 100}
            className="btn btn-sm btn-accent"
            style={{ width: '100%' }}
          >
            Withdraw to UPI / Bank
          </button>
        </div>

        <div className="glass-panel glow-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Net Earned</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(108, 71, 255, 0.15)' }}>
              <TrendingUp size={20} color="var(--brand-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ₹{(earnings?.totalEarned || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            After {earnings?.platformPercent || 15}% platform maintenance fee
          </div>
        </div>

        <div className="glass-panel glow-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Copies Sold</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255, 179, 71, 0.15)' }}>
              <BookOpen size={20} color="#FFB347" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {totalSalesCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across {products.length} published titles
          </div>
        </div>

        <div className="glass-panel glow-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Product Revenue</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255, 107, 107, 0.15)' }}>
              <DollarSign size={20} color="var(--brand-secondary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total customer checkout volume
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Your E-Books & Knowledge Products</h2>
          <button onClick={() => setShowUpload(true)} className="btn btn-sm btn-secondary">
            <Plus size={15} /> Add Another
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading your catalog...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <BookOpen size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No products published yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Upload your first e-book or PDF guide to start monetizing immediately.
            </p>
            <button onClick={() => setShowUpload(true)} className="btn btn-primary">
              Upload First E-Book
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>E-Book Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Sales</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Marketing & Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.category}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--brand-accent)' }}>
                      ₹{p.price}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{p.totalSales} units</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{p.totalRevenue} gross</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={p.status === 'APPROVED' ? 'badge badge-success' : 'badge badge-warning'}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedProductForShare(p)}
                          className="btn btn-sm btn-primary"
                          title="Generate Tracking Link & QR Code for Ads"
                        >
                          <Share2 size={14} />
                          Ad Link & QR
                        </button>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="btn btn-sm btn-secondary"
                          title="View Live Sales Page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Withdrawals & Payout Transfers
        </h2>
        {earnings?.withdrawals && earnings.withdrawals.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Admin Note</th>
                </tr>
              </thead>
              <tbody>
                {earnings.withdrawals.map((w: any) => (
                  <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>₹{w.amount}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{w.method}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={
                        w.status === 'COMPLETED' ? 'badge badge-success' :
                        w.status === 'PENDING' ? 'badge badge-warning' : 'badge badge-danger'
                      }>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {w.adminNote || 'Processing via Razorpay Payouts'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '1rem 0' }}>
            No withdrawal requests made yet. When your balance reaches ₹100 or more, click "Withdraw to UPI / Bank".
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={loadDashboardData}
        />
      )}

      {selectedProductForShare && (
        <ShareLinkModal
          product={selectedProductForShare}
          onClose={() => setSelectedProductForShare(null)}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          walletBalance={earnings?.walletBalance || 0}
          onClose={() => setShowWithdraw(false)}
          onSuccess={loadDashboardData}
        />
      )}
    </div>
  );
}