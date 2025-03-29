import fs from 'fs';
import { renamedFolderPath } from './constants';
import { findMediaFileBySize, getFileSize, listAllTables } from './db/queries';
import { join } from 'path';
import { readMp3Metadata } from './renameFilesFromMetadata';
import { checkDatabase } from './db';

export const findFinalFilesFromRenamed = async () => {
  const allRenamedFiles = await fs.promises.readdir(renamedFolderPath);
  const firstFile = allRenamedFiles[0];
  const fileSize = getFileSize(join(renamedFolderPath, firstFile));
  const metadata = await readMp3Metadata(join(renamedFolderPath, firstFile));

  console.log('First file', firstFile, metadata, fileSize);

  if (!metadata.duration || !fileSize) {
    console.log('No metadata or file size', firstFile);
    return;
  }

  const dbFiles = await findMediaFileBySize({
    size: fileSize,
  });

  console.log('DB file', dbFiles?.length);
};

findFinalFilesFromRenamed();
