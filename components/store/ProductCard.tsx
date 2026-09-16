'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Zap, Star, TrendingUp } from 'lucide-react';
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
      avatar?: string | null;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const sales = product.totalSales || 0;
  const reviews = Math.max(sales * 3, 8);
  const isHot = sales > 20;

  return (
    <>
      <div
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Entire card is a link */}
        <Link href={`/product/${product.slug}`} className="product-card-link" aria-label={product.title}>
          {/* Cover image area */}
          <div className="product-card-image-wrap">
            <img
              src={product.coverImage}
              alt={product.title}
              className="product-card-image"
              style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            />
            {/* Gradient overlay */}
            <div className="product-card-overlay" />

            {/* Badges top-left */}
            <div className="product-card-badges">
              <span className="pc-badge pc-badge-cat">{product.category}</span>
              {isHot && (
                <span className="pc-badge pc-badge-hot">
                  <TrendingUp size={10} />
                  Hot
                </span>
              )}
            </div>

            {/* Price badge bottom-right */}
            <div className="product-card-price">₹{product.price}</div>
          </div>

          {/* Card body */}
          <div className="product-card-body">
            <div className="product-card-meta">
              {product.pageCount && (
                <span className="product-card-meta-item">
                  <FileText size={12} />
                  {product.pageCount}p
                </span>
              )}
              <span className="product-card-meta-item product-card-rating">
                <Star size={12} fill="#FFB347" color="#FFB347" />
                4.9 <span style={{ color: 'var(--text-subtle)' }}>({reviews})</span>
              </span>
              {sales > 0 && (
                <span className="product-card-meta-item" style={{ marginLeft: 'auto' }}>
                  {sales} sold
                </span>
              )}
            </div>

            <h3 className="product-card-title">{product.title}</h3>
            <p className="product-card-desc">{product.shortDesc}</p>

            <div className="product-card-footer">
              <div className="product-card-author">
                {product.seller?.avatar && (
                  <img src={product.seller.avatar} alt="" className="product-card-avatar" />
                )}
                <span>{product.seller?.storeName || product.seller?.name || 'Verified Author'}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Buy button overlays at bottom — prevents link navigation */}
        <button
          className="product-card-buy-btn"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
        >
          <Zap size={14} />
          Buy Now
        </button>
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