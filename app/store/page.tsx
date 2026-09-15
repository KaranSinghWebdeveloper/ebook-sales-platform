'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, BookOpen, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';

const CATEGORIES = ['All', 'Business & Tech', 'Engineering', 'Finance', 'Marketing', 'Productivity'];

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
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore Digital Assets & E-Books
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Find high-converting frameworks, technical guides, and business PDFs with instant 1-click Razorpay delivery.
        </p>
      </div>

      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.4rem 0.8rem',
          flex: '1 1 300px',
          maxWidth: '450px',
        }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Filter by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.92rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--brand-primary)' : 'var(--border-color)',
                background: selectedCategory === cat ? 'rgba(108, 71, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? '#B892FF' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Released</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <BookOpen size={32} color="var(--brand-primary)" />
          </div>
          <div>Loading curated catalog...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '16px' }}>
          <AlertCircle size={40} color="var(--brand-secondary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No e-books match your search term or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="btn btn-secondary"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
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