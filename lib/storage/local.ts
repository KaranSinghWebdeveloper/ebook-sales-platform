import fs from 'fs';
import path from 'path';
import { StorageAdapter, StorageUploadResult } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(
    buffer: Buffer,
    filename: string,
    subfolder: string = 'products'
  ): Promise<StorageUploadResult> {
    const targetFolder = path.join(this.baseDir, subfolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = `${Date.now()}_${cleanName}`;
    const fullPath = path.join(targetFolder, uniqueName);

    await fs.promises.writeFile(fullPath, buffer);

    const relativeKey = path.join(subfolder, uniqueName).replace(/\\/g, '/');

    return {
      fileKey: relativeKey,
      fileSize: buffer.length,
      url: `/api/download/preview?key=${encodeURIComponent(relativeKey)}`,
    };
  }

  async getBuffer(fileKey: string): Promise<Buffer> {
    const safeKey = path.normalize(fileKey).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.baseDir, safeKey);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${safeKey}`);
    }

    return await fs.promises.readFile(fullPath);
  }

  async delete(fileKey: string): Promise<boolean> {
    try {
      const safeKey = path.normalize(fileKey).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.join(this.baseDir, safeKey);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async exists(fileKey: string): Promise<boolean> {
    const safeKey = path.normalize(fileKey).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.baseDir, safeKey);
    return fs.existsSync(fullPath);
  }
}