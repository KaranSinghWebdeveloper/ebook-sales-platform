'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Zap, Star } from 'lucide-react';
import { BuyModal } from './BuyModal';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    price: number;
    coverImage: string;
    category: string;
    pageCount?: number | null;
    totalSales?: number;
    seller?: {
      name: string;
      storeName?: string | null;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="glow-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#12121e' }}>
          <img
            src={product.coverImage}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.4rem',
          }}>
            <span className="badge badge-primary">{product.category}</span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            background: 'rgba(10, 10, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.75rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: 'var(--brand-accent)',
            border: '1px solid rgba(0, 212, 170, 0.3)',
          }}>
            ₹{product.price}
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {product.pageCount && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FileText size={14} />
                {product.pageCount} Pages (PDF)
              </span>
            )}
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FFB347' }}>
              <Star size={13} fill="#FFB347" />
              4.9 ({(product.totalSales || 12) * 3} ratings)
            </span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: '0.5rem',
              transition: 'color 0.2s',
            }}>
              {product.title}
            </h3>
          </Link>

          <p style={{
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.shortDesc}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              By <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.seller?.storeName || product.seller?.name || 'Verified Author'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href={`/product/${product.slug}`} className="btn btn-sm btn-secondary">
                Details
              </Link>
              <button onClick={() => setShowModal(true)} className="btn btn-sm btn-primary">
                <Zap size={14} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <BuyModal
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            coverImage: product.coverImage,
            pageCount: product.pageCount,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}