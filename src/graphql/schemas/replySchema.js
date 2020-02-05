import { gql } from "apollo-server";

export default gql`
  type Reply {
    id: ID!
    postId: Post!
    userEmail: User!
    text: String

    extend type Query {
        reply(id: ID!): Reply!
    }

    extend type Mutation {
        createReply(text: String!): Reply!
    }
  }
`;
