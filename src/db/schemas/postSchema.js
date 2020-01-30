import { Schema } from "mongoose";

export const PostSchema = new Schema(
  {
    /** The user that created the post */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    /** The text string of the post message */
    text: {
      type: String,
      required: true
    },
    /**Title of the post */
    title: {
      type: String,
      default: "(No title)"
    },
    csTopic: {
      type: String,
      enum: [
        "CSCI-127",
        "CSCI-135",
        "CSCI-136",
        "CSCI-150",
        "CSCI-235",
        "CSCI-160",
        "CSCI-335",
        "CSCI-260",
        "CSCI-265",
        "CSCI-340",
        "CSCI-Electives",
        "General"
      ],
      default: "General"
    },
    /** Array of replied messages */
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply"
      }
    ],
    /** Only visible to administrators if true */
    private: {
      type: Boolean,
      default: false
    },
    /** Poster's name is replaced with 'anonymous' if true */
    anonymity: {
      type: Boolean,
      default: false
    },
    /** Array of users that like the comment or found it helpful */
    upVotes: {
      type: Array,
      default: []
    },
    /** Array of users that dislike the comment or found it unhelpful */
    downVotes: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);
