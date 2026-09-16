import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { getStorage } from '@/lib/storage';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch seller products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const shortDesc = formData.get('shortDesc') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const category = (formData.get('category') as string) || 'General';
    const tags = (formData.get('tags') as string) || '';
    const pageCountStr = formData.get('pageCount') as string;
    const coverUrlInput = formData.get('coverImage') as string;

    const pdfFile = formData.get('file') as File | null;
    const coverFile = formData.get('coverFile') as File | null;

    // Collect up to 5 gallery image files
    const galleryFiles: File[] = [];
    for (let i = 0; i < 5; i++) {
      const gf = formData.get(`galleryFile_${i}`);
      console.log(`galleryFile_${i}:`, gf ? (gf as any).name : 'null');
      if (gf && typeof (gf as File).arrayBuffer === 'function') galleryFiles.push(gf as File);
    }
    console.log('Total gallery files found:', galleryFiles.length);
    // Also collect gallery URL inputs (optional fallback)
    const galleryUrlsRaw = (formData.get('galleryUrls') as string) || '';
    const galleryUrlsInput = galleryUrlsRaw.split('\n').map(u => u.trim()).filter(Boolean).slice(0, 5);

    if (!title || !shortDesc || !priceStr) {
      return NextResponse.json({ error: 'Title, short description, and price are required' }, { status: 400 });
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'Price must be a valid positive number' }, { status: 400 });
    }

    const storage = getStorage();
    let fileKey = 'products/sample_default.pdf';
    let fileSize = 1024 * 500;

    if (pdfFile && typeof pdfFile.arrayBuffer === 'function') {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const uploadRes = await storage.upload(buffer, pdfFile.name, 'products');
      fileKey = uploadRes.fileKey;
      fileSize = uploadRes.fileSize;
    }

    let coverImage = coverUrlInput || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
    if (coverFile && typeof coverFile.arrayBuffer === 'function') {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const uploadCover = await storage.upload(coverBuffer, coverFile.name, 'previews');
      coverImage = `/api/download/preview?key=${encodeURIComponent(uploadCover.fileKey)}`;
    }

    // Upload gallery images
    const galleryImageUrls: string[] = [...galleryUrlsInput];
    for (const gFile of galleryFiles) {
      if (galleryImageUrls.length >= 5) break;
      const gBuffer = Buffer.from(await gFile.arrayBuffer());
      const gUpload = await storage.upload(gBuffer, gFile.name, 'previews');
      galleryImageUrls.push(`/api/download/preview?key=${encodeURIComponent(gUpload.fileKey)}`);
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    const shareKey = Math.random().toString(36).substring(2, 10);

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        slug,
        shortDesc: shortDesc.trim(),
        description: (description || shortDesc).trim(),
        price,
        coverImage,
        fileKey,
        fileSize,
        pageCount: pageCountStr ? parseInt(pageCountStr, 10) : null,
        category,
        tags,
        sellerId: user.id,
        shareKey,
        galleryImages: JSON.stringify(galleryImageUrls),
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}