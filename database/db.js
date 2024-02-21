const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let db;

const init = async () => {
  if (db) return db; // If db is already initialized, return it.
  
  db = await sqlite.open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });

  await db.exec(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0
    )`
  );

  console.log('Connected to the in-memory SQLite database.');
};

const getDb = () => {
  if (!db) {
    throw new Error('Database has not been initialized. Please call init first.');
  }
  return db;
};

module.exports = { init, getDb };
