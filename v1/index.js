const { ApolloServer, gql } = require('apollo-server');

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
    animals: () => {},
    shelters: () => {},
    pets: () => {},
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🐕🐈 server ready at ${url}`);
});
