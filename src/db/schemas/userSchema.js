import { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
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
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
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

UserSchema.pre("save", async function(next) {
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;

  next();
});

export { UserSchema };
