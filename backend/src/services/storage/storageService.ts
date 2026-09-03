import path from 'path';
import fs from 'fs';
import { env } from '../../config/env.js';

export interface UploadResult {
  fileUrl: string;
  fileKey: string;
  mimeType: string;
  size: number;
}

export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<UploadResult> {
    if (env.STORAGE_PROVIDER === 'cloudinary' && env.CLOUDINARY_CLOUD_NAME) {
      // Cloudinary integration point
      // Fallback to local storage if API keys not full
    }

    // Local Disk Storage Handler
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, filename);

    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } else if (file.path && fs.existsSync(file.path)) {
      fs.copyFileSync(file.path, filePath);
    }

    const fileUrl = `/uploads/${filename}`;
    return {
      fileUrl,
      fileKey: filename,
      mimeType: file.mimetype || 'application/octet-stream',
      size: file.size || 0,
    };
  }

  public async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, fileKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (err) {
      console.error('[StorageService] Error deleting file:', err);
      return false;
    }
  }
}

export const storageService = new StorageService();
