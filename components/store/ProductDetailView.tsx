'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Download, Star, CheckCircle2, Share2, ArrowLeft, Lock, FileText, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { BuyModal } from './BuyModal';
import { ProductCard } from './ProductCard';

interface RelatedProduct {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  price: number;
  coverImage: string;
  category: string;
  pageCount?: number | null;
  totalSales?: number;
  seller?: { name: string; storeName?: string | null; avatar?: string | null };
}

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
    fileSize?: number;
    galleryImages?: string | null;
    seller: {
      name: string;
      storeName?: string | null;
      bio?: string | null;
      avatar?: string | null;
      previewUrl?: string | null;
    };
  };
  relatedProducts?: RelatedProduct[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailProps) {
  const [showBuy, setShowBuy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fileSizeMB = product.fileSize ? (product.fileSize / (1024 * 1024)).toFixed(1) : null;

  // Parse gallery images
  let galleryImages: string[] = [];
  try {
    const parsed = JSON.parse(product.galleryImages || '[]');
    if (Array.isArray(parsed)) galleryImages = parsed;
  } catch { galleryImages = []; }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <div className="container pd-breadcrumb-inner">
          <Link href="/store" className="pd-breadcrumb-back">
            <ArrowLeft size={15} />
            Store
          </Link>
          <span className="pd-breadcrumb-sep">/</span>
          <span className="pd-breadcrumb-cat">{product.category}</span>
          <span className="pd-breadcrumb-sep">/</span>
          <span className="pd-breadcrumb-current">{product.title}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '2rem 1.5rem 0 1.5rem' }}>
        <div className="pd-layout">
          {/* LEFT: product info */}
          <div className="pd-left">
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <span className="badge badge-success">Verified E-Book</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#FFB347' }}>
                <Star size={13} fill="#FFB347" />
                4.9 / 5.0 &nbsp;·&nbsp; {(product.totalSales || 0) + 15} reviews
              </span>
            </div>

            <h1 className="pd-title">{product.title}</h1>
            <p className="pd-short-desc">{product.shortDesc}</p>

            {/* Stats row */}
            <div className="pd-stats-row">
              {product.pageCount && (
                <div className="pd-stat">
                  <FileText size={16} color="var(--brand-primary)" />
                  <span>{product.pageCount} Pages</span>
                </div>
              )}
              <div className="pd-stat">
                <TrendingUp size={16} color="var(--brand-accent)" />
                <span>{product.totalSales || 0} sold</span>
              </div>
              <div className="pd-stat">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lang:</span>
                <span>{product.language}</span>
              </div>
              {fileSizeMB && (
                <div className="pd-stat">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Size:</span>
                  <span>{fileSizeMB} MB</span>
                </div>
              )}
            </div>

            {/* Cover image */}
            <div className="pd-cover-wrap glass-panel">
              <img
                src={product.coverImage}
                alt={product.title}
                className="pd-cover-img"
              />
            </div>

            {/* Gallery images */}
            {galleryImages.length > 0 && (
              <div className="pd-section">
                <h2 className="pd-section-title">Preview Gallery</h2>
                {/* Large featured image */}
                <div style={{
                  width: '100%', borderRadius: '14px', overflow: 'hidden',
                  marginBottom: '0.75rem', position: 'relative',
                  background: 'rgba(15,15,25,0.6)',
                }}>
                  <img
                    src={galleryImages[galleryIndex]}
                    alt={`Preview ${galleryIndex + 1}`}
                    style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block' }}
                  />
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setGalleryIndex(i => (i - 1 + galleryImages.length) % galleryImages.length)}
                        style={{
                          position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                          width: '36px', height: '36px', cursor: 'pointer', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      ><ChevronLeft size={18} /></button>
                      <button
                        onClick={() => setGalleryIndex(i => (i + 1) % galleryImages.length)}
                        style={{
                          position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                          width: '36px', height: '36px', cursor: 'pointer', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      ><ChevronRight size={18} /></button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {galleryImages.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        style={{
                          padding: 0, border: 'none', borderRadius: '8px', overflow: 'hidden',
                          cursor: 'pointer', opacity: galleryIndex === i ? 1 : 0.5,
                          transition: 'opacity 0.2s',
                          outline: galleryIndex === i ? '2px solid var(--brand-primary)' : 'none',
                          outlineOffset: '2px',
                        }}
                      >
                        <img
                          src={src}
                          alt={`Thumb ${i + 1}`}
                          style={{ width: '72px', height: '52px', objectFit: 'cover', display: 'block' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="pd-section">
              <h2 className="pd-section-title">About This Digital Asset</h2>
              <div className="pd-description">{product.description}</div>
            </div>

            {/* What's included */}
            <div className="pd-section glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>What's Included</h3>
              {[
                `Full unlocked PDF e-book${product.pageCount ? ` (${product.pageCount}+ pages)` : ''}`,
                'Instant browser download — 1-time secure access',
                'Anti-piracy protected download token',
                'Direct author updates & errata access',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                  <CheckCircle2 size={17} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {product.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} style={{
                      padding: '0.25rem 0.65rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Author card */}
            <div className="pd-author glass-panel">
              <img
                src={product.seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={product.seller.name}
                className="pd-author-avatar"
              />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: 600, marginBottom: '0.2rem' }}>PUBLISHED AUTHOR</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{product.seller.storeName || product.seller.name}</div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {product.seller.bio || 'Verified content publisher on DigiVault.'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: sticky buy card */}
          <div className="pd-right">
            <div className="pd-buy-card glass-panel glow-card">
              <div className="pd-buy-header">
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>One-time purchase</div>
                  <div className="pd-buy-price">₹{product.price}</div>
                </div>
                <button onClick={handleShare} className="btn btn-sm btn-secondary" title="Copy link">
                  <Share2 size={14} />
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>

              <button
                onClick={() => setShowBuy(true)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', marginBottom: '0.75rem' }}
              >
                <Zap size={17} />
                Buy Now — ₹{product.price}
              </button>

              <div className="pd-trust-list">
                <div className="pd-trust-item">
                  <ShieldCheck size={16} color="var(--brand-accent)" />
                  <span>256-bit secured Razorpay gateway</span>
                </div>
                <div className="pd-trust-item">
                  <Download size={16} color="var(--brand-primary)" />
                  <span>Instant PDF unlock after payment</span>
                </div>
                <div className="pd-trust-item">
                  <Lock size={16} color="#FFB347" />
                  <span>1-time download · anti-piracy token</span>
                </div>
              </div>

              <div className="pd-meta-list">
                <div className="pd-meta-row">
                  <span>Format</span>
                  <span>PDF Document</span>
                </div>
                {product.pageCount && (
                  <div className="pd-meta-row">
                    <span>Pages</span>
                    <span>{product.pageCount}</span>
                  </div>
                )}
                <div className="pd-meta-row">
                  <span>Language</span>
                  <span>{product.language}</span>
                </div>
                <div className="pd-meta-row">
                  <span>Delivery</span>
                  <span style={{ color: 'var(--brand-accent)' }}>Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products section */}
      {relatedProducts.length > 0 && (
        <div className="pd-related">
          <div className="container">
            <div className="pd-related-header">
              <h2 className="pd-related-title">More in <span className="gradient-text-primary">{product.category}</span></h2>
              <Link href={`/store?category=${encodeURIComponent(product.category)}`} className="btn btn-sm btn-secondary">
                View all
              </Link>
            </div>
            <div className="store-grid store-grid--related">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </div>
      )}

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