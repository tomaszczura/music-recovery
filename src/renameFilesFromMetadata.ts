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

  const filesToRename = notRenamedFiles.slice(0, 100);

  for (const fileName of filesToRename) {
    const filePath = `${folderPath}/${fileName}`;
    console.log(`Reading metadata for ${filePath}`);
    try {
      const { artists, title } = await readMp3Metadata(filePath);
      if (!title) {
        console.log(`No title found for ${filePath}`);
        continue;
      }
      const newTitle = artists.join(', ') + ' - ' + title;
      let newPath = join(folderPath, newTitle + '.mp3');
      console.log(`Renaming ${filePath} to ${newPath}`);
      if (fs.existsSync(newPath)) {
        console.log(`File ${newPath} already exists`);
        newPath = join(folderPath, newTitle + ` (1).mp3`);
      }

      if (!fs.existsSync(newPath)) {
        await fs.promises.rename(filePath, `${folderPath}/${newTitle}.mp3`);
      } else {
        console.log(`File ${newPath} already exists - skipping`);
      }
    } catch (error) {
      console.error(`Error reading metadata for ${fileName}:`, error);
    }
  }
};

renameFilesFromMetadata(mainFolderPath);
