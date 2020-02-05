import { gql } from "apollo-server";

export default gql`
  type Post {
    id: ID!
    userId: User!
    text: String
    title: String
    csTopic: String
    replies: [Reply!]!
    private: Boolean
    anonymity: Boolean
    upVotes: [String]
    downVotes: [String]

    extend type Query {
        post(id: ID!): Post!
        post(csTopic: String!): Post!
        posts: [Post!]!
    }

    extend type Mutation {
        createPost(title: String!, text: String!): Post!
    }
  }
`;
