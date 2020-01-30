import { model } from "mongoose";
import {
  UserSchema,
  PostSchema,
  ChatMsgSchema,
  ChatSchema,
  ReplySchema
} from "./schemas/index";

const User = model("User", UserSchema);
const Post = model("Post", PostSchema);
const Chat = model("Chat", ChatSchema);
const ChatMsg = model("ChatMsg", ChatMsgSchema);
const Reply = model("Reply", ReplySchema);

export { User, Post, Chat, ChatMsg, Reply };
