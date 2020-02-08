import { ApolloError } from "apollo-server";
import mongoose from "mongoose";

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
    },
    likePost: async (
      parent,
      { id, userId },
      { models: { postModel, userModel } }
    ) => {
      try {
        const post = await postModel.findById(id);
        const user = await userModel.findById(userId);
        const user_id = new mongoose.Types.ObjectId(user.id);

        const found = post.upVotes.find(function(element) {
          return element.toString() === user_id.toString();
        });

        if (found) {
          post.upVotes = post.upVotes.filter(function(element) {
            return !(element.toString() === user_id.toString());
          });
        } else {
          post.upVotes.push(user_id);
          post.downVotes = post.downVotes.filter(function(element) {
            return !(element.toString() === user_id.toString());
          });
        }

        await post.save();

        return "Post has been liked!";
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    dislikePost: async (
      parent,
      { id, userId },
      { models: { postModel, userModel } }
    ) => {
      try {
        const post = await postModel.findById(id);
        const user = await userModel.findById(userId);
        const user_id = new mongoose.Types.ObjectId(user.id);

        const found = post.downVotes.find(function(element) {
          return element.toString() === user_id.toString();
        });

        if (found) {
          post.downVotes = post.downVotes.filter(function(element) {
            return !(element.toString() === user_id.toString());
          });
        } else {
          post.downVotes.push(user_id);
          post.upVotes = post.upVotes.filter(function(element) {
            return !(element.toString() === user_id.toString());
          });
        }

        await post.save();

        return "Post has been disliked!";
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
};
