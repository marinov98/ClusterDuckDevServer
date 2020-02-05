import { gql } from "apollo-server";

export default gql`
  type Post {
    id: ID!
    userId: User!
    text: String!
    title: String
    csTopic: String!
    replies: [Reply!]!
    private: Boolean
    anonymity: Boolean
    upVotes: [String]
    downVotes: [String]

    extend type Query {
        getPost(id: ID!): Post!
        getPostByTopic(csTopic: String!): [Post!]
        postByUser(id: ID!): User!
        posts: [Post!]!
    }

    extend type Mutation {
        createPost(title: String!, text: String!): Post!
    }
  }
`;
