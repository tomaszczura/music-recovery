import path from 'path';

export const mainFolderPath = path.join(
  '/',
  'Users',
  'tomasz',
  'Muzyka',
  'Moje'
);
export const rawFolderPath = path.join(mainFolderPath, 'Raw');
export const renamedFolderPath = path.join(mainFolderPath, 'Renamed');
export const finalFolderPath = path.join(mainFolderPath, 'Final');
export const notTaggedFolderPath = path.join(mainFolderPath, 'NotTagged');

export const dbPath = path.join(mainFolderPath, 'navidrome.db');
