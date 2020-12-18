const sqlite3 = require('sqlite3');

const dbPath = './db/sqlite.db';

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.log(err);
  } else {
    db.get('PRAGMA foreign_keys = ON');
    console.log(`connected to ${dbPath}`);
  }
});

const queryDb = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      console.log(`${sql} ${params}`);
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { queryDb };
