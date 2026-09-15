export interface StorageUploadResult {
  fileKey: string;
  fileSize: number;
  url?: string;
}

export interface StorageAdapter {
  upload(
    buffer: Buffer,
    filename: string,
    subfolder?: string
  ): Promise<StorageUploadResult>;
  getBuffer(fileKey: string): Promise<Buffer>;
  delete(fileKey: string): Promise<boolean>;
  exists(fileKey: string): Promise<boolean>;
}