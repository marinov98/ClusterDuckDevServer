import { gql } from "apollo-server";

export default gql`
  type Reply {
    id: ID!
    postId: Post!
    userEmail: User!
    text: String

    extend type Query {
        reply(id: ID!): Reply!
        postReplies(postId: Post!): [Reply!]!
    }

    extend type Mutation {
        createReply(postId: Post!, userEmail: User!, text: String!): Reply!
    }
  }
`;
