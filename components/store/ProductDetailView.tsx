'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Download, Star, CheckCircle2, Share2, ArrowLeft, Lock } from 'lucide-react';
import { BuyModal } from './BuyModal';

interface ProductDetailProps {
  product: {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    description: string;
    price: number;
    coverImage: string;
    category: string;
    pageCount?: number | null;
    tags?: string;
    language: string;
    totalSales: number;
    seller: {
      name: string;
      storeName?: string | null;
      bio?: string | null;
      avatar?: string | null;
    };
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const [showBuy, setShowBuy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.title}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '3.5rem',
        alignItems: 'start',
      }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{product.category}</span>
            <span className="badge badge-success">Verified E-Book</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#FFB347' }}>
              <Star size={14} fill="#FFB347" />
              4.9/5.0 ({product.totalSales + 15} Reviews)
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
            {product.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.shortDesc}
          </p>

          <div className="glass-panel" style={{
            padding: '1.5rem',
            borderRadius: '20px',
            marginBottom: '2.5rem',
            textAlign: 'center',
            background: 'rgba(15, 15, 25, 0.6)',
          }}>
            <img
              src={product.coverImage}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '440px',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              }}
            />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              About This Digital Asset
            </h2>
            <div style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {product.description}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>What's Included with Purchase</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--brand-accent)" />
                <span style={{ fontSize: '0.92rem' }}>Full unlocked digital PDF e-book ({product.pageCount || 100}+ pages)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--brand-accent)" />
                <span style={{ fontSize: '0.92rem' }}>Instant browser download link + email confirmation token</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--brand-accent)" />
                <span style={{ fontSize: '0.92rem' }}>72-hour multi-device download token (up to 5 devices)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--brand-accent)" />
                <span style={{ fontSize: '0.92rem' }}>Direct author updates & errata access</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <img
              src={product.seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={product.seller.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-accent)', fontWeight: 600 }}>PUBLISHED AUTHOR</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{product.seller.storeName || product.seller.name}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {product.seller.bio || 'Verified content publisher on DigiVault.'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '5.5rem' }}>
          <div className="glass-panel glow-card" style={{ padding: '2rem', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Special Direct Price</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--brand-accent)', lineHeight: 1 }}>
                  ₹{product.price}
                </div>
              </div>
              <button onClick={handleShare} className="btn btn-sm btn-secondary" title="Copy Link for Ads / Social">
                <Share2 size={15} />
                {copied ? 'Copied Link!' : 'Share'}
              </button>
            </div>

            <button
              onClick={() => setShowBuy(true)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}
            >
              <Zap size={18} />
              Buy Now with Razorpay
            </button>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={18} color="var(--brand-accent)" />
                <span>Secured by 256-Bit Razorpay Payment Gateway</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Download size={18} color="var(--brand-primary)" />
                <span>Instant automated PDF unlock right after payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Lock size={18} color="#FFB347" />
                <span>Anti-piracy protected download token</span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Format</span>
                <span style={{ fontWeight: 600 }}>Protected PDF Document</span>
              </div>
              {product.pageCount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pages</span>
                  <span style={{ fontWeight: 600 }}>{product.pageCount} Pages</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Language</span>
                <span style={{ fontWeight: 600 }}>{product.language}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ fontWeight: 600, color: 'var(--brand-accent)' }}>Instant (Automated)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBuy && (
        <BuyModal
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            coverImage: product.coverImage,
            pageCount: product.pageCount,
          }}
          onClose={() => setShowBuy(false)}
        />
      )}
    </div>
  );
}