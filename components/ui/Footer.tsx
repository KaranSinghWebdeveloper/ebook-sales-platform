import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Zap, Lock, CreditCard } from 'lucide-react';

export function Footer({ siteName = 'DigiVault' }: { siteName?: string }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(10, 10, 18, 0.95)',
      marginTop: '6rem',
      padding: '4rem 0 2rem 0',
    }}>
      <div className="container">
        {/* Trust Badges Banner */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(0, 212, 170, 0.12)' }}>
              <ShieldCheck size={22} color="var(--brand-accent)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Razorpay Secured</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UPI, Cards, NetBanking</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(108, 71, 255, 0.15)' }}>
              <Zap size={22} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Instant PDF Access</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated download tokens</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255, 179, 71, 0.15)' }}>
              <Lock size={22} color="#FFB347" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Anti-Piracy Protected</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Time-limited signed streams</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255, 107, 107, 0.15)' }}>
              <CreditCard size={22} color="var(--brand-secondary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>85% Seller Payout</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct UPI/Bank withdrawals</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BookOpen size={17} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }} className="gradient-text">
                {siteName}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '340px' }}>
              The high-converting, direct sales marketplace for knowledge creators, writers, engineers, and digital educators.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Marketplace</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link href="/store" style={{ transition: 'color 0.2s' }}>All E-Books & PDFs</Link></li>
              <li><Link href="/store?category=Business" style={{ transition: 'color 0.2s' }}>Business & SaaS</Link></li>
              <li><Link href="/store?category=Engineering" style={{ transition: 'color 0.2s' }}>Software Engineering</Link></li>
              <li><Link href="/store?category=Finance" style={{ transition: 'color 0.2s' }}>Trading & Investing</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Sellers</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link href="/dashboard/upload">Upload New Product</Link></li>
              <li><Link href="/dashboard/links">Ad Campaign Link Generator</Link></li>
              <li><Link href="/dashboard/earnings">Wallet & Withdrawals</Link></li>
              <li><Link href="/register?role=SELLER">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Administration</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li><Link href="/admin">Super Admin Portal</Link></li>
              <li><Link href="/admin/appearance">Dynamic Theme Editor</Link></li>
              <li><Link href="/admin/commissions">Commission Split Manager</Link></li>
              <li><Link href="/admin/withdrawals">Payout Approvals</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>© {new Date().getFullYear()} {siteName}. All rights reserved. Powered by Next.js & Razorpay.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Instant Download Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}