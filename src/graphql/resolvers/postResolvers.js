// import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    getPost: async (parent, { id }, { models: { postModel } }) => {
      const post = await postModel.findById(id);
      return post;
    },
    getPostByTopic: async (parent, { csTopic }, { models: { postModel } }) => {
      const posts = await postModel.find({ csTopic: csTopic });
      return posts;
    },
    posts: async (parent, args, { models: { postModel } }) => {
      const posts = await postModel.find().sort({ _id: -1 });
      return posts;
    }
  },
  Mutation: {
    createPost: async (parent, args, { models: { postModel, userModel } }) => {
      const newPost = await postModel.create(args);
      await newPost.save();

      const userWhoPosted = await userModel.findById(args.userId);
      userWhoPosted.posts.push(newPost);
      await userWhoPosted.save();

      return newPost;
    }
  }
};
