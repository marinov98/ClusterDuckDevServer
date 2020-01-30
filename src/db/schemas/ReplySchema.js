import { Schema } from "mongoose";

export const ReplySchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    userEmail: {
      type: String,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
