import { notTaggedFolderPath, rawFolderPath } from './constants';
import fs from 'fs';
import path, { join } from 'path';
import { findMediaFileBySize, getFileSize } from './db/queries';
import { database } from './db';

export const renameRawToNotTagged = async () => {
  const allRawFiles = await fs.promises.readdir(rawFolderPath);

  const rawFilesToCheck = allRawFiles.slice(0, 1000);

  for (const fileName of rawFilesToCheck) {
    const filePath = join(rawFolderPath, fileName);
    const fileSize = getFileSize(filePath);

    if (!fileSize) {
      console.log(`No file size for ${filePath}`);
      continue;
    }

    const dbFiles = await findMediaFileBySize({ size: fileSize });

    if (dbFiles?.length) {
      console.log(`Found ${dbFiles.length} files for ${filePath}`);
      if (dbFiles.length === 0) {
        console.log(`File not found in db: ${fileName}`);
      } else if (dbFiles.length === 1) {
        const dbFile = dbFiles[0];
        const artist = dbFile.artist;
        const title = dbFile.title;
        const fileName = [artist, title].filter(Boolean).join(' - ');
        let newFilePath = join(notTaggedFolderPath, `${fileName}.mp3`);
        if (fs.existsSync(newFilePath)) {
          newFilePath = join(
            notTaggedFolderPath,
            `${fileName} (${Date.now()}).mp3`
          );
        }
        fs.promises.rename(filePath, newFilePath);
      } else {
        console.log(`Found ${dbFiles.length} files for ${filePath}`);
      }
    } else {
      console.log(`No files found for ${filePath}`);
    }
  }
  await database.destroy();
};

renameRawToNotTagged();
