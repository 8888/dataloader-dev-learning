CREATE TABLE Animals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE Shelters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE Pets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  animalId INTEGER references Animals(id) ON DELETE RESTRICT NOT NULL,
  shelterId INTEGER references Shelters(id) ON DELETE RESTRICT NOT NULL
);