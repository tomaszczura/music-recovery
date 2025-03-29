import { database } from '../db';
import fs from 'fs';

interface MediaFile {
  id: number;
  path: string;
  duration: number;
  size: number;
}

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

export const listAllTables = async (): Promise<string[]> => {
  try {
    const result = await database.raw(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    return result.map((row: any) => row.name);
  } catch (error) {
    console.error('Error listing tables:', error);
    throw error;
  }
};
