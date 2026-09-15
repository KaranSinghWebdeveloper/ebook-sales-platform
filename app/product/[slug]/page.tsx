import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ProductDetailView } from '@/components/store/ProductDetailView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | DigiVault`,
    description: product.shortDesc,
    openGraph: {
      title: product.title,
      description: product.shortDesc,
      images: [{ url: product.coverImage }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      seller: {
        select: {
          name: true,
          storeName: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });

  if (!product || product.status !== 'APPROVED') {
    notFound();
  }

  return <ProductDetailView product={product} />;
}