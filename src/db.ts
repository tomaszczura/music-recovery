import knex from 'knex';
import { dbPath } from './constants';

// Initialize knex with SQLite configuration
export const database = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

console.log('Database path:', dbPath);

// Check if database exists and is readable
export const checkDatabase = async (): Promise<boolean> => {
  try {
    // Try to query the sqlite_master table which exists in all SQLite databases
    await database.raw('SELECT name FROM sqlite_master LIMIT 1');
    return true;
  } catch (error) {
    console.error('Database check failed:', error);
    return false;
  }
};
