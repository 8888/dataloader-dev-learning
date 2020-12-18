const { gql } = require('apollo-server');

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
`;
