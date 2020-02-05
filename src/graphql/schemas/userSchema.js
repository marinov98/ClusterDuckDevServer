import { gql } from "apollo-server";

export default gql`
  type User {
    id: ID!
    username: String
    firstName: String
    lastName: String
    email: String
    posts: [String!]!
    refreshToken: Token
    isAdmin: Boolean
  }

  type Token {
    token: String!
    refreshToken: String
  }

  extend type Query {
    user(id: ID!): User!
    userByEmail(email: String!): User!
    usersByStatus(isAdmin: Boolean!): [User!]!
    userPosts(id: ID!): [Post!]!
    login(email: String!, password: String!): Token!
  }

  extend type Mutation {
    registerUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
      confirmedPassword: String!
    ): String!
    googleLogin(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
      token: String!
    ): Token!
    refreshToken(refreshToken: String): Token!
    rejectToken: String!
  }
`;
