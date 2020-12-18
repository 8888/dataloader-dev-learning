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
    animal: (parent, _) => animalLoader.load(parent.animalId),
    shelter: (parent, _) => shelterLoader.load(parent.shelterId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🐕🐈 server ready at ${url}`);
});
