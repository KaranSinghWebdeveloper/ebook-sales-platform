'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Download, Sparkles } from 'lucide-react';

export function HeroSection({ siteName, tagline }: { siteName: string; tagline: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/store');
    }
  };

  return (
    <section style={{ position: 'relative', padding: '3.5rem 0 5rem 0', overflow: 'hidden' }}>
      <div className="bg-ambient-glow" style={{ top: '-100px', left: '15%', opacity: 0.6 }} />
      <div className="bg-ambient-glow" style={{ top: '100px', right: '10%', background: 'radial-gradient(circle, var(--brand-accent-glow) 0%, transparent 70%)', opacity: 0.4 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.9fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.9rem',
              background: 'rgba(108, 71, 255, 0.15)',
              border: '1px solid rgba(108, 71, 255, 0.35)',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#B892FF',
              marginBottom: '1.5rem',
            }}>
              <Sparkles size={15} color="var(--brand-accent)" />
              Direct Knowledge Marketplace • Razorpay Integrated
            </div>

            <h1 style={{
              fontSize: '3.4rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}>
              Learn From The Best. <br />
              <span className="gradient-text">Instant Digital Books & PDFs.</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px',
            }}>
              Directly download battle-tested blueprints, engineering guides, and business playbooks. Powered by automated Razorpay checkout and secure instant PDF delivery.
            </p>

            <form onSubmit={handleSearch} style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '0.4rem',
              maxWidth: '520px',
              marginBottom: '2rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: 'var(--text-muted)' }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by title, topic, or keyword (e.g. SaaS, Next.js, Trading)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">₹45L+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Creator Sales Volume</div>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }} />
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>12,400+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDFs Downloaded</div>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }} />
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-accent)' }}>85%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seller Revenue Split</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel glow-card animate-float" style={{
              width: '320px',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}>
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
                alt="Featured Book"
                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1rem' }}
              />
              <div style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="badge badge-primary">Best Seller</span>
                  <span style={{ color: 'var(--brand-accent)', fontWeight: 800, fontSize: '1.2rem' }}>₹499</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                  Micro-SaaS Founder’s Playbook
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  142 Pages PDF • Instant Access
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{
              position: 'absolute',
              top: '12%',
              left: '-20px',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
            }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(0, 212, 170, 0.2)' }}>
                <ShieldCheck size={18} color="var(--brand-accent)" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Razorpay 1-Click</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UPI & Cards Accepted</div>
              </div>
            </div>

            <div className="glass-panel" style={{
              position: 'absolute',
              bottom: '8%',
              right: '-25px',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
            }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(108, 71, 255, 0.2)' }}>
                <Download size={18} color="var(--brand-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Direct PDF Delivery</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Automated Token</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}