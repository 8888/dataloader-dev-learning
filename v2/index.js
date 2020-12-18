const { ApolloServer, gql } = require('apollo-server');
const DataLoader = require('dataloader');

const db = require('../db');

// Think of these as our models
const Animal = {
  all: async () => await db.all(`select * from Animals;`),
  many: async (ids) => {
    const mask = db.paramMask(ids.length);
    const sql = `select * from Animals where id in (${mask});`;
    return await db.all(sql, ids);
  },
};

const Shelter = {
  all: async () => await db.all(`select * from Shelters;`),
  many: async (ids) => {
    const mask = db.paramMask(ids.length);
    const sql = `select * from Shelters where id in (${mask});`;
    return await db.all(sql, ids);
  },
};

const Pet = {
  all: async () => await db.all(`select * from Pets;`),
};

// Dataloaders

// Batch functions are the logic that will handle retrieving multiple rows from
// the db. They should be able to receive an array of any number of keys, and
// query for those records, returning the results.
//
// A DataLoader batch function must uphold two constraints
// 1) The returned array of values must be the same length as the provided array of keys
// 2) Each index in the returned array of values must correspond to the same index in the keys
//
// Because of this, we need to map to explicitly return undefined or null for certain values
// example
// input = [8, 2, 9]
// data from the DB = [
//    { id: 9, name: 'Nora' },
//    { id: 8, name: 'Finn' }
// ]
// Key 2 doesn't exist in the DB, so nothing was returned
// Now the returned array is not the same length
// It is also in a different order because that may not always be guranteed by your backend service
// We have to reorder the array and insert a value for key 2
// return [
//    { id: 8, name: 'Finn' },
//    null,
//    { id: 9, name: 'Nora' },
// ]
const batchGetAnimals = async (animalIds) => {
  const animals = await Animal.many(animalIds);
  return animalIds.map(id => animals.find(animal => animal.id == id));
};

const batchGetShelters = async (shelterIds) => {
  const shelters = await Shelter.many(shelterIds);
  return shelterIds.map(id => shelters.find(shelter => shelter.id == id));
};

const animalLoader = new DataLoader(batchGetAnimals);
const shelterLoader = new DataLoader(batchGetShelters);

// GraphQL schema
const typeDefs = gql`
  type Animal {
    id: ID!
    name: String!
  }

  type Shelter {
    id: ID!
    name: String!
  }

  type Pet {
    id: ID!
    name: String!
    animal: Animal!
    shelter: Shelter!
  }

  type Query {
    animals: [Animal]!
    shelters: [Shelter]!
    pets: [Pet]!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    animals: () => Animal.all(),
    shelters: () => Shelter.all(),
    pets: () => Pet.all(),
  },
  Pet: {
    animal: (parent) => animalLoader.load(parent.animalId),
    shelter: (parent) => shelterLoader.load(parent.shelterId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🐕🐈 server ready at ${url}`);
});
