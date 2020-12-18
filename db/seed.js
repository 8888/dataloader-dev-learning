const sqlite3 = require('sqlite3');

const dbPath = './db/sqlite.db';

const animals = [
  { name: 'Dog' },
  { name: 'Cat' },
];

const shelters = [
  { name: 'Best Friends' },
  { name: 'ASPCA' },
  { name: 'Social Tees' },
  { name: 'Animal Haven' },
];

const pets = [
  { name: 'Nora', animalId: 1, shelterId: 2 },
  { name: 'Finn', animalId: 1, shelterId: 1 },
  { name: 'Milo', animalId: 1, shelterId: 2 },
  { name: 'Samantha', animalId: 1, shelterId: 3 },
  { name: 'Smokey', animalId: 1, shelterId: 3 },
  { name: 'Lenny', animalId: 1, shelterId: 4 },
  { name: 'Layla', animalId: 1, shelterId: 4 },
  { name: 'Snarf', animalId: 2, shelterId: 1 },
  { name: 'Sir', animalId: 2, shelterId: 2 },
  { name: 'Eve', animalId: 2, shelterId: 2 },
  { name: 'Luna', animalId: 2, shelterId: 4 },
  { name: 'Pearl', animalId: 2, shelterId: 4 },
];

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.log(err);
  } else {
    db.get('PRAGMA foreign_keys = ON');
    console.log(`connected to ${dbPath}`);
  }
});

db.serialize(() => {
  // Animals
  const animalsStmt = db.prepare(`
    insert into Animals
    (name)
    values (?);
  `);
  animals.forEach(animal => {
    animalsStmt.run(
      animal.name,
    );
  });
  animalsStmt.finalize();

  // Shelters
  const sheltersStmt = db.prepare(`
    insert into Shelters
    (name)
    values (?);
  `);
  shelters.forEach(shelter => {
    sheltersStmt.run(
      shelter.name,
    );
  });
  sheltersStmt.finalize();

  // Pets
  const petsStmt = db.prepare(`
    insert into Pets
    (name, animalId, shelterId)
    values (?, ?, ?);
  `);
  pets.forEach(pet => {
    petsStmt.run(
      pet.name,
      pet.animalId,
      pet.shelterId,
    );
  });
  petsStmt.finalize();
});

db.close();
