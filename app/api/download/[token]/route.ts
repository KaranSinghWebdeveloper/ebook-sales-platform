import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStorage } from '@/lib/storage';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const downloadRecord = await prisma.downloadToken.findUnique({
      where: { token },
      include: { product: true, order: true },
    });

    if (!downloadRecord) {
      return NextResponse.json({ error: 'Invalid or expired download link' }, { status: 404 });
    }

    if (new Date() > new Date(downloadRecord.expiresAt)) {
      return NextResponse.json({ error: 'This download link has expired (72h limit)' }, { status: 410 });
    }

    if (downloadRecord.downloadCount >= downloadRecord.maxDownloads) {
      return NextResponse.json({ error: 'Download limit reached for this access token' }, { status: 403 });
    }

    const storage = getStorage();
    const buffer = await storage.getBuffer(downloadRecord.product.fileKey);

    // Increment download counter
    await prisma.downloadToken.update({
      where: { id: downloadRecord.id },
      data: { downloadCount: { increment: 1 } },
    });

    const safeTitle = downloadRecord.product.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTitle}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('File stream error:', error);
    return NextResponse.json({ error: 'Failed to stream secure file' }, { status: 500 });
  }
}