import React from 'react';
import { getTheme } from '@/lib/theme';
import { HeroSection } from '@/components/marketing/HeroSection';
import { CategoriesGrid } from '@/components/marketing/CategoriesGrid';
import { FeaturedProducts } from '@/components/marketing/FeaturedProducts';
import { HowItWorks } from '@/components/marketing/HowItWorks';

export default async function HomePage() {
  const theme = await getTheme();

  return (
    <div>
      <HeroSection siteName={theme.siteName} tagline={theme.tagline} />
      <CategoriesGrid />
      <FeaturedProducts />
      <HowItWorks />
    </div>
  );
}