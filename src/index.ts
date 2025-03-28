import * as mm from 'music-metadata';
import fs from 'fs';
import { join } from 'path';

async function readMp3Metadata(filePath: string) {
  try {
    // Read metadata
    const metadata = await mm.parseFile(filePath);

    console.log('Title:', metadata.common.title);
    console.log('Artist:', metadata.common.artist);
    console.log('Album:', metadata.common.album);
    console.log('Genre:', metadata.common.genre);
    console.log('Year:', metadata.common.year);
    console.log('Duration (seconds):', metadata.format.duration);
    console.log('Rating:', metadata.common.rating);

    console.log('Common', metadata.common);
    console.log('Format', metadata.format);
    console.log('Native', metadata.native);
    console.log('Qualit', metadata.quality);
  } catch (error) {
    console.error('Error reading metadata:', error);
  }
}

const folderPath = '/others/Muzyka/Moje';
const fileName = 'f86965512.mp3';

readMp3Metadata(join(folderPath, fileName));
