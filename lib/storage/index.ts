import { StorageAdapter } from './types';
import { LocalStorageAdapter } from './local';

let storageInstance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    const adapterType = process.env.STORAGE_ADAPTER || 'local';
    if (adapterType === 'local') {
      storageInstance = new LocalStorageAdapter();
    } else {
      // Future adapters: R2 / S3 can be plugged in here seamlessly
      storageInstance = new LocalStorageAdapter();
    }
  }
  return storageInstance;
}

export * from './types';