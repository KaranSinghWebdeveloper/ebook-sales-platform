'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, BookOpen, AlertCircle, Flame, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';

const CATEGORIES = ['All', 'Business & Tech', 'Engineering', 'Finance', 'Marketing', 'Productivity'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular', icon: Flame },
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'price-low', label: 'Price ↑', icon: DollarSign },
  { value: 'price-high', label: 'Price ↓', icon: DollarSign },
];

function StoreContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm.trim()) queryParams.set('q', searchTerm.trim());
        if (selectedCategory && selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (sortBy) queryParams.set('sort', sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (err) {
        console.error('Failed to load store catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchCatalog, 200);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero header */}
      <div className="store-hero">
        <div className="container">
          <div className="store-hero-inner">
            <div className="store-hero-badge">
              <Flame size={13} />
              Premium Digital Knowledge Store
            </div>
            <h1 className="store-hero-title">
              Discover Premium<br />
              <span className="gradient-text-primary">E-Books & Guides</span>
            </h1>
            <p className="store-hero-sub">
              Instant Razorpay checkout · Secure 1-click PDF delivery · Anti-piracy protected
            </p>

            {/* Search bar */}
            <div className="store-search-wrap">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                id="store-search"
                placeholder="Search by title, topic or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="store-search-input"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="store-filter-bar">
        <div className="container store-filter-inner">
          {/* Category pills */}
          <div className="store-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`store-cat-pill${selectedCategory === cat ? ' store-cat-pill--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="store-sort-row">
            <SlidersHorizontal size={15} color="var(--text-muted)" />
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`store-sort-pill${sortBy === opt.value ? ' store-sort-pill--active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
        {/* Results count */}
        {!loading && products.length > 0 && (
          <div className="store-results-info">
            <TrendingUp size={15} />
            {products.length} product{products.length !== 1 ? 's' : ''} found
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          </div>
        )}

        {loading ? (
          <div className="store-loading">
            <div className="store-loading-spinner" />
            <div>Loading curated catalog...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="store-empty glass-panel">
            <AlertCircle size={40} color="var(--brand-secondary)" />
            <h3>No products found</h3>
            <p>No e-books match your current filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="store-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading store...</div>}>
      <StoreContent />
    </Suspense>
  );
}