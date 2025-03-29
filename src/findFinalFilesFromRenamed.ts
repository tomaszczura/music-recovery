import fs from 'fs';
import { finalFolderPath, renamedFolderPath } from './constants';
import { findMediaFileBySize, getFileSize } from './db/queries';
import { join } from 'path';
import { readMp3Metadata } from './renameFilesFromMetadata';
import { database } from './db';

export const findFinalFilesFromRenamed = async () => {
  const allRenamedFiles = await fs.promises.readdir(renamedFolderPath);

  const filesToCheck = allRenamedFiles.slice(0, 6000);

  let i = 0;
  for (const fileName of filesToCheck) {
    const filePath = join(renamedFolderPath, fileName);
    const fileSize = getFileSize(filePath);
    const metadata = await readMp3Metadata(filePath);

    console.log(`${i} Checking file`, filePath);

    if (!metadata.duration || !fileSize) {
      console.log('No metadata or file size', filePath);
      continue;
    }

    const dbFiles = await findMediaFileBySize({
      size: fileSize,
    });

    if (dbFiles?.length) {
      console.log(`Found ${dbFiles.length} files for ${filePath}`);
      const dbFile = dbFiles.find((f) => f.title === metadata.title);
      if (dbFile) {
        const newFilePath = join(finalFolderPath, fileName);
        fs.promises.rename(filePath, newFilePath);
      } else {
        console.log(
          `Title not match for ${fileName}`,
          dbFiles.map((f) => f.title)
        );
      }
    } else {
      console.log(`No files found for ${filePath}`);
    }
    i++;
  }

  await database.destroy();
};

findFinalFilesFromRenamed();
