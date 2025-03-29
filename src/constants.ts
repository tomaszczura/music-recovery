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
export const dbPath = path.join(mainFolderPath, 'navidrome.db');
