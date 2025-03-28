import * as mm from 'music-metadata';
import fs from 'fs';
import { join } from 'path';

const mainFolderPath = '/others/Muzyka/Moje';
const rawFolderPath = join(mainFolderPath, 'Raw');
const renamedFolderPath = join(mainFolderPath, 'Renamed');

async function readMp3Metadata(filePath: string) {
  // Read metadata
  const metadata = await mm.parseFile(filePath);

  return {
    title: metadata.common.title,
    artists: metadata.common.artists || [metadata.common.artist] || ['Unknown'],
  };
}

const renameFilesFromMetadata = async (folderPath: string) => {
  const folderFiles = await fs.promises.readdir(folderPath);
  const notRenamedFiles = folderFiles
    .sort()
    .filter((fileName) => fileName.startsWith('f'));
  console.log(`Found ${notRenamedFiles.length} files in ${folderPath}`);

  const filesToRename = notRenamedFiles.slice(0, 5000);

  let i = 0;
  for (const fileName of filesToRename) {
    const filePath = join(folderPath, fileName);
    console.log(`${i} Reading metadata for ${filePath}`);
    try {
      const { artists, title } = await readMp3Metadata(filePath);
      if (!title) {
        console.log(`No title found for ${filePath}`);
        continue;
      }
      // replace slashes with - in title
      const newTitle = (artists.join(', ') + ' - ' + title).replace(/\//g, '-');
      let newPath = join(renamedFolderPath, newTitle + '.mp3');
      console.log(`Renaming ${filePath} to ${newPath}`);
      if (fs.existsSync(newPath)) {
        console.log(`File ${newPath} already exists`);
        newPath = join(renamedFolderPath, newTitle + ` (1).mp3`);
      }

      if (!fs.existsSync(newPath)) {
        await fs.promises.rename(filePath, newPath);
      } else {
        console.log(`File ${newPath} already exists - skipping`);
      }
    } catch (error) {
      console.error(`Error reading metadata for ${fileName}:`, error);
    }
    i++;
  }
};

renameFilesFromMetadata(rawFolderPath);
