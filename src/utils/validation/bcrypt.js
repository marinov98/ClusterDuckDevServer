import bcrypt from "bcryptjs";
import { User } from "./../../db/models";
/**
 *
 * Hashing utility functions
 *
 */
async function hashPasswordAndSave(newUser) {
  try {
    // hash password
    const hash = await bcrypt.hash(newUser.password, 12);
    newUser.password = hash;

    // save to database
    await User.create(newUser);
  } catch (err) {
    console.error(err);
  }
}

async function comparePasswords(inputPassword, hashedPassword) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (err) {
    console.error(err);
  }
}

export { hashPasswordAndSave, comparePasswords };
