import { database } from '../db';
import fs from 'fs';
import { MediaFile } from '../dbTypes';

export const findMediaFileBySize = async ({
  size,
}: {
  size: number;
}): Promise<MediaFile[] | null> => {
  try {
    const result = await database<MediaFile>('media_file').where('size', size);
    return result || null;
  } catch (error) {
    console.error('Error finding media file:', error);
    throw error;
  }
};

export const listAllFiles = async () => {
  const result = await database<MediaFile>('media_file').select('*');
  return result;
};

// Helper function to get file size in bytes
export const getFileSize = (filePath: string): number | null => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return null;
  }
};
