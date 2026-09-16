import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const storage = getStorage();
    const exists = await storage.exists(key);

    if (!exists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const buffer = await storage.getBuffer(key);

    const ext = path.extname(key).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: 'Failed to load preview' }, { status: 500 });
  }
}
