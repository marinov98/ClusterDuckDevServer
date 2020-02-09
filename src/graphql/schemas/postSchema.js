import { gql } from "apollo-server";

export default gql`
  type Post {
    id: ID!
    userId: String!
    text: String!
    title: String
    csTopic: String!
    replies: [Reply!]!
    private: Boolean
    anonymity: Boolean
    upVotes: [String]
    downVotes: [String]
  }

  extend type Query {
    post(id: ID!): Post!
    postByTopic(csTopic: String!): [Post!]
    userByPost(id: ID!): User!
    posts: [Post!]!
  }

  extend type Mutation {
    createPost(
      title: String
      text: String!
      userId: String!
      anonymity: Boolean
      private: Boolean
      csTopic: String
    ): Post!
    likePost(id: ID!, userId: String!): String!
    dislikePost(id: ID!, userId: String!): String!
  }
`;
