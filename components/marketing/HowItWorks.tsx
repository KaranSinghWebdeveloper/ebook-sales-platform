'use client';

import React, { useState } from 'react';
import { ShoppingBag, CreditCard, Download, UploadCloud, Share2, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HowItWorks() {
  const [tab, setTab] = useState<'buyer' | 'seller'>('buyer');

  return (
    <section id="how-it-works" style={{ padding: '5rem 0', background: 'rgba(15, 15, 25, 0.4)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Frictionless Protocol</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Engineered For Immediate Results
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Whether you're acquiring tactical insights or publishing your proprietary playbook, DigiVault delivers high-speed automation.
          </p>

          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.35rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-color)',
            marginTop: '1.5rem',
          }}>
            <button
              onClick={() => setTab('buyer')}
              style={{
                padding: '0.55rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: tab === 'buyer' ? 'linear-gradient(135deg, var(--brand-primary), #8E54E9)' : 'transparent',
                color: tab === 'buyer' ? '#FFFFFF' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              For Readers & Buyers
            </button>
            <button
              onClick={() => setTab('seller')}
              style={{
                padding: '0.55rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: tab === 'seller' ? 'linear-gradient(135deg, var(--brand-accent), #00A896)' : 'transparent',
                color: tab === 'seller' ? '#0A0A12' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              For Authors & Sellers
            </button>
          </div>
        </div>

        {tab === 'buyer' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(108, 71, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <ShoppingBag size={24} color="var(--brand-primary)" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
                STEP 01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Select E-Book or PDF</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Browse curated, author-verified guides across software architecture, SaaS entrepreneurship, finance, and trading.
              </p>
            </div>

            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(0, 212, 170, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <CreditCard size={24} color="var(--brand-accent)" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '0.35rem' }}>
                STEP 02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Razorpay 1-Click Pay</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Pay instantly via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking with end-to-end 256-bit bank encryption.
              </p>
            </div>

            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255, 179, 71, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Download size={24} color="#FFB347" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFB347', marginBottom: '0.35rem' }}>
                STEP 03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Instant Secure Download</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Receive your direct PDF download immediately in-browser and backed up to your email with a 72-hour anti-piracy access token.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(0, 212, 170, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <UploadCloud size={24} color="var(--brand-accent)" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-accent)', marginBottom: '0.35rem' }}>
                STEP 01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Upload PDF & Set Price</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Upload your digital product to our protected server storage. Set your custom price in ₹ with instant approval.
              </p>
            </div>

            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(108, 71, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Share2 size={24} color="var(--brand-primary)" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
                STEP 02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Generate Ad Links & QR</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Get custom UTM share links and downloadable high-res QR codes to market your product across Instagram, YouTube, and Meta Ads.
              </p>
            </div>

            <div className="glass-panel glow-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255, 107, 107, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Wallet size={24} color="var(--brand-secondary)" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-secondary)', marginBottom: '0.35rem' }}>
                STEP 03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.65rem' }}>Earn 85% & Withdraw</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Each sale instantly credits your seller dashboard wallet. Request one-click withdrawals directly to your Indian bank or UPI.
              </p>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/register?role=SELLER" className="btn btn-lg btn-primary">
            Start Selling Your E-Books Today
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}