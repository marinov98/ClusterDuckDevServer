import { ApolloError } from "apollo-server";

export default {
  Query: {
    user: async (parent, { id }, { models: { userModel } }) => {
      try {
        return await userModel.findById(id);
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    userByEmail: async (parent, { email }, { models: { userModel } }) => {
      try {
        return await userModel.findOne({ email: email });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    usersByStatus: async (parent, { isAdmin }, { models: { userModel } }) => {
      try {
        return await userModel.find({ isAdmin: isAdmin });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    userPosts: async (parent, { id }, { models: { userModel } }) => {
      try {
        const user = await userModel.findById(id).populate("posts");
        return user.posts;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
};
