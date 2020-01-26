import { Schema } from "mongoose";

export const UserSchema = new Schema({
  /** Username used for logging in */
  username: {
    type: String,
    required: true
  },
  /** Password */
  password: {
    type: String,
    required: true
  },
  /** The user's first name */
  firstName: {
    type: String,
    required: true
  },
  /** The user's last name */
  lastName: {
    type: String,
    required: true
  },
  /** The user's email address */
  email: {
    type: String,
    required: true
  },
  /** Array of the user's posted messages */
  posts: {
    type: Array,
    default: []
  },
  /** User's refresh token for authorization */
  refreshToken: {
    type: String,
    default: ""
  },
  /** User is treated as an administrator if true */
  isAdmin: {
    type: Boolean,
    default: false
  }
});
