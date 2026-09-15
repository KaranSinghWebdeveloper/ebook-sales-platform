import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial platform data...');

  // 1. Super Admin
  const adminPass = await bcrypt.hash('adminpassword123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@digivault.com' },
    update: {},
    create: {
      email: 'admin@digivault.com',
      name: 'System Super Admin',
      password: adminPass,
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerified: true,
      walletBalance: 12500,
    },
  });

  // 2. Sample Seller
  const sellerPass = await bcrypt.hash('sellerpassword123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@digivault.com' },
    update: {},
    create: {
      email: 'seller@digivault.com',
      name: 'Alex Rivera',
      password: sellerPass,
      role: 'SELLER',
      storeName: 'Apex Knowledge Labs',
      bio: 'Bestselling author of modern engineering guides and micro-SaaS blueprints.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isVerified: true,
      walletBalance: 4200,
      upiId: 'alexrivera@upi',
    },
  });

  // 3. Default Commission
  const existingCommission = await prisma.commission.findFirst();
  if (!existingCommission) {
    await prisma.commission.create({
      data: {
        platformPercent: 15.0,
        sellerPercent: 85.0,
        isDefault: true,
      },
    });
  }

  // 4. Default Theme in PlatformSettings
  await prisma.platformSettings.upsert({
    where: { key: 'site_theme' },
    update: {},
    create: {
      key: 'site_theme',
      value: JSON.stringify({
        primaryColor: '#6C47FF',
        secondaryColor: '#FF6B6B',
        accentColor: '#00D4AA',
        bgDark: '#0A0A12',
        bgSurface: '#13131F',
        textPrimary: '#F6F6FD',
        textMuted: '#8E8EA8',
        fontFamily: 'Inter',
        borderRadius: '14px',
        siteName: 'DigiVault',
        tagline: 'Direct E-Books & High-Value PDF Knowledge Products',
      }),
    },
  });

  // Ensure mock uploads folder has real sample PDF files
  const uploadDir = path.join(process.cwd(), 'uploads', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const samplePdfContent = Buffer.from(
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n200\n%%EOF'
  );

  const file1 = 'saas_blueprint.pdf';
  const file2 = 'clean_architecture.pdf';
  const file3 = 'algorithmic_investing.pdf';

  fs.writeFileSync(path.join(uploadDir, file1), samplePdfContent);
  fs.writeFileSync(path.join(uploadDir, file2), samplePdfContent);
  fs.writeFileSync(path.join(uploadDir, file3), samplePdfContent);

  // 5. Seed initial products
  const p1 = await prisma.product.upsert({
    where: { slug: 'micro-saas-founders-handbook' },
    update: {},
    create: {
      slug: 'micro-saas-founders-handbook',
      title: 'The Micro-SaaS Founder’s Execution Playbook (2026 Edition)',
      shortDesc: 'From zero idea to ₹2,50,000/month recurring revenue in 90 days with zero external funding.',
      description: 'A comprehensive, battle-tested blueprint for technical and non-technical founders to design, validate, launch, and monetize profitable micro-software and digital tools. Includes launch checklists, pricing psychology, email marketing scripts, and organic acquisition funnels.',
      price: 499,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      fileKey: 'products/saas_blueprint.pdf',
      fileSize: 1845000,
      pageCount: 142,
      category: 'Business & Tech',
      tags: 'SaaS,Startup,Business,Marketing',
      language: 'English',
      status: 'APPROVED',
      totalSales: 38,
      totalRevenue: 18962,
      sellerId: seller.id,
      shareKey: 'saas2026',
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: 'mastering-fullstack-architecture' },
    update: {},
    create: {
      slug: 'mastering-fullstack-architecture',
      title: 'Full-Stack Architecture Patterns: Next.js, Microservices & Distributed Caches',
      shortDesc: 'Deep dive into high-concurrency systems, event queues, Redis caching, and bulletproof security.',
      description: 'Engineered for senior developers, engineering leads, and technical architects. Learn production-grade architectural patterns, database partitioning, idempotency, zero-downtime migrations, and secure file pipelines with practical TypeScript codebases.',
      price: 799,
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      fileKey: 'products/clean_architecture.pdf',
      fileSize: 3420000,
      pageCount: 228,
      category: 'Engineering',
      tags: 'Next.js,Architecture,Coding,DevOps',
      language: 'English',
      status: 'APPROVED',
      totalSales: 24,
      totalRevenue: 19176,
      sellerId: seller.id,
      shareKey: 'archmaster',
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: 'systematic-investing-options-playbook' },
    update: {},
    create: {
      slug: 'systematic-investing-options-playbook',
      title: 'Systematic Capital & Asymmetric Options Strategies for Retail Traders',
      shortDesc: 'Mathematical risk hedging, volatility modeling, and systematic rule-based capital deployment.',
      description: 'Stop guessing price action. Master non-directional theta decay, delta neutral adjustment techniques, and quantitative risk management frameworks refined over 10 years of live market execution.',
      price: 999,
      coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      fileKey: 'products/algorithmic_investing.pdf',
      fileSize: 2150000,
      pageCount: 175,
      category: 'Finance',
      tags: 'Finance,Investing,Trading,Wealth',
      language: 'English',
      status: 'APPROVED',
      totalSales: 19,
      totalRevenue: 18981,
      sellerId: seller.id,
      shareKey: 'algotrade',
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Admin user: admin@digivault.com / adminpassword123');
  console.log('Seller user: seller@digivault.com / sellerpassword123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });