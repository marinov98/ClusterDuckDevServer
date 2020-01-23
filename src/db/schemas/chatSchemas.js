import { Schema } from "mongoose";

export const ChatSchema = new Schema({
  /** Array of users that are apart of the chat */
  chatters: {
    type: Array
  },
  /** Array of chat messages that were sent to the chat */
  messages: {
    type: Array
  }
});

export const ChatMsgSchema = new Schema({
  /** The user that created the message */
  poster: {
    type: Schema.Types.ObjectId,
    required: true
  },
  /** The text string of the chat message */
  text: {
    type: String
  }
});
