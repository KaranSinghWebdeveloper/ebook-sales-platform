'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

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
  const sales = product.totalSales || 0;
  // Deterministic rating between 4.8 and 4.99 based on product ID
  const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.8 + ((hash % 20) / 100);
  const reviewCount = Math.max(sales * 3, 12);

  return (
    <Link href={`/product/${product.slug}`} className="pc" aria-label={product.title}>
      {/* Cover */}
      <div className="pc-img-wrap">
        <img src={product.coverImage} alt={product.title} className="pc-img" loading="lazy" />
      </div>

      {/* Body */}
      <div className="pc-body">
        <span className="pc-category">{product.category}</span>
        <h3 className="pc-title">{product.title}</h3>

        {/* Author */}
        <div className="pc-author-row">
          {product.seller?.avatar ? (
            <img src={product.seller.avatar} alt="" className="pc-author-avatar" />
          ) : (
            <span className="pc-author-avatar pc-author-avatar--placeholder">
              {(product.seller?.storeName || product.seller?.name || 'A').charAt(0)}
            </span>
          )}
          <span className="pc-author-name">{product.seller?.storeName || product.seller?.name || 'Author'}</span>
        </div>

        {/* Bottom: rating + price */}
        <div className="pc-bottom">
          <div className="pc-rating">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{rating.toFixed(1)}</span>
            <span className="pc-rating-count">({reviewCount})</span>
          </div>
          <div className="pc-price">₹{product.price}</div>
        </div>
      </div>
    </Link>
  );
}