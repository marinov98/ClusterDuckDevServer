export default {
  Query: {
    postReplies: async (parent, { id }, { models: { postModel } }) => {
      try {
        const post = await postModel.findById(id).populate("replies");
        return post.replies;
      } catch (err) {
        throw new Error("Could not get user replies");
      }
    }
  },
  Mutation: {
    createReply: async (
      parent,
      args,
      { models: { postModel, replyModel } }
    ) => {
      try {
        const newReply = await replyModel.create(args);
        await newReply.save();

        const postToRecieveReply = await postModel.findById(args.postId);
        await postToRecieveReply.save();

        return newReply;
      } catch (err) {
        throw new Error("Could not create reply");
      }
    }
  }
};
