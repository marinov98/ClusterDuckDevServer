import { gql } from "apollo-server";

export default gql`
  type User {
    id: ID!
    username: String
    firstName: String
    lastName: String
    email: String
    posts: [Post!]!
    refreshToken: String
    isAdmin: Boolean
  }

  type Token {
    token: String!
  }

  extend type Query {
    user(id: ID!): User!
    user(email: String!): User
    login(email: String!, password: String!): Token!
  }

  extend type Mutation {
    registerUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): User!
  }
`;
