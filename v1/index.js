const { ApolloServer, gql } = require('apollo-server');

const db = require('../db');

// Think of these as our models
const Animal = {
  all: async () => await db.all(`select * from Animals;`),
  get: async (id) => await db.get(`select * from Animals where id in (?);`, id),
};

const Shelter = {
  all: async () => await db.all(`select * from Shelters;`),
  get: async (id) => await db.get(`select * from Shelters where id in (?);`, id),
};

const Pet = {
  all: async () => await db.all(`select * from Pets;`),
};

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
    animal: (parent) => Animal.get(parent.animalId),
    shelter: (parent) => Shelter.get(parent.shelterId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🐕🐈 server ready at ${url}`);
});
