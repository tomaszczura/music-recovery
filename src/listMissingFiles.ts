import { basename, join } from 'path';
import { finalFolderPath, mainFolderPath } from './constants';
import { database } from './db';
import { listAllFiles } from './db/queries';
import fs from 'fs';
import { log } from 'console';

const replacePolishLetters = (text: string): string => {
  const polishLetters: { [key: string]: string } = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z',
  };

  return text
    .replace(
      /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
      (letter) => polishLetters[letter] || letter
    )
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII chars;
};

export const listMissingFiles = async () => {
  const allFiles = await listAllFiles();

  const allFinalFiles = await fs.promises.readdir(finalFolderPath);
  const cleanedAllFinalFiles = allFinalFiles.map((file) => {
    // Convert special unicode characters to their ASCII equivalents
    return replacePolishLetters(file.toLowerCase());
  });

  const allFilesNames = allFiles.map((file) => basename(file.path));

  const missingFiles = allFilesNames.filter(
    (file) =>
      !cleanedAllFinalFiles.includes(
        replacePolishLetters(file).toLowerCase().toString()
      )
  );
  const missingFilesPath = join(mainFolderPath, 'missingFiles.txt');
  await fs.promises.writeFile(
    missingFilesPath,
    missingFiles.map((file) => `${file}`).join('\n')
  );

  const redundantFiles = cleanedAllFinalFiles.filter(
    (file) => !allFilesNames.includes(file)
  );

  const redundantFilesPath = join(mainFolderPath, 'redundantFiles.txt');
  await fs.promises.writeFile(
    redundantFilesPath,
    redundantFiles.map((file) => `${file}`).join('\n')
  );
  await database.destroy();
};

listMissingFiles();
