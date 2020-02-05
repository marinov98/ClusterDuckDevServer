import { ApolloError } from "apollo-server";

export default {
  Query: {
    post: async (parent, { id }, { models: { postModel } }) => {
      try {
        const post = await postModel.findById(id);
        return post;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    postByTopic: async (parent, { csTopic }, { models: { postModel } }) => {
      try {
        const posts = await postModel.find({ csTopic: csTopic });
        return posts;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    posts: async (parent, args, { models: { postModel } }) => {
      try {
        const posts = await postModel.find().sort({ _id: -1 });
        return posts;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    userByPost: async (parent, { id }, { models: { postModel } }) => {
      try {
        const userByPost = await postModel.findById(id).populate("userId");
        return userByPost;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  },
  Mutation: {
    createPost: async (parent, args, { models: { postModel, userModel } }) => {
      try {
        const newPost = await postModel.create(args);
        await newPost.save();

        const userWhoPosted = await userModel.findById(args.userId);
        userWhoPosted.posts.push(newPost);
        await userWhoPosted.save();

        return newPost;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
};
