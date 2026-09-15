'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Code, TrendingUp, Megaphone, Brain, Palette } from 'lucide-react';

const CATEGORIES = [
  { name: 'Business & Tech', icon: Briefcase, count: 48, color: '#6C47FF' },
  { name: 'Engineering', icon: Code, count: 62, color: '#00D4AA' },
  { name: 'Finance', icon: TrendingUp, count: 35, color: '#FFB347' },
  { name: 'Marketing', icon: Megaphone, count: 29, color: '#FF6B6B' },
  { name: 'Productivity', icon: Brain, count: 41, color: '#B892FF' },
  { name: 'Design Systems', icon: Palette, count: 23, color: '#4EA8DE' },
];

export function CategoriesGrid() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Curated Library</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore High-Impact Topics</h2>
          </div>
          <Link href="/store" className="btn btn-sm btn-secondary">
            View Full Catalog
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
        }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/store?category=${encodeURIComponent(cat.name)}`}
                className="glow-card"
                style={{
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: `${cat.color}1A`,
                  marginBottom: '1rem',
                }}>
                  <Icon size={24} color={cat.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {cat.count}+ Digital Assets
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}