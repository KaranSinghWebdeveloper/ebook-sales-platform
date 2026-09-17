import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/store/ProductCard';

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { status: 'APPROVED' },
    orderBy: { totalSales: 'desc' },
    take: 6,
    include: {
      seller: {
        select: { name: true, storeName: true },
      },
    },
  });

  if (!products.length) return null;

  return (
    <section style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Verified Best Sellers</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Top Rated E-Books & Playbooks</h2>
          </div>
          <Link href="/store" className="btn btn-sm btn-secondary">
            Browse All ({products.length})
          </Link>
        </div>

        <div className="store-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}