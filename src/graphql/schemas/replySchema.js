import { gql } from "apollo-server";

export default gql`
  type Reply {
    id: ID!
    postId: String!
    userEmail: String!
    text: String
  }
  extend type Query {
    postReplies(postId: String!): [Reply!]!
  }

  extend type Mutation {
    createReply(postId: String!, userEmail: String!, text: String!): Reply!
  }
`;
