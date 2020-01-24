// Authentication routes
import express from "express";
import jwt from "jsonwebtoken";
import config from "./../utils/config/config";
import { User } from "./../db/models";
import {
  validateLogin,
  validateRegister
} from "./../utils/validation/validate";
import {
  hashPasswordAndSave,
  comparePasswords
} from "./../utils/validation/bcrypt";
const router = express.Router();

/**
 *  Register endpoint
 *  @route POST api/auth/register
 *  @desc Register user
 *  @access Public
 */
router.post("/register", async (req, res, next) => {
  try {
    // validate user input from registration form
    const { error } = validateRegister(req.body);

    if (error) return res.status(404).json({ error: error.details[0].message });

    // if validated, make sure email has not already been used
    const userWithSameEmail = await User.findOne({ email: req.body.email });

    if (userWithSameEmail)
      return res.status(409).json({ error: "Email already exists!" });

    const userWithSameUsername = await User.findOne({
      username: req.body.username
    });

    if (userWithSameUsername)
      return res.status(409).json({ error: "Username already exists!" });

    // check to see if user is admin or not
    const isAdmin = req.body.isAdmin ? true : false;

    // If email and username are unique, create new user
    const userToBeCreated = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      isAdmin,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    await hashPasswordAndSave(userToBeCreated);

    return res.status(201).json({ message: "New user created" });
  } catch (err) {
    next(err);
  }
});

/**
 *  Login endpoint
 *  @route POST api/auth/login
 *  @desc Login user
 *  @access Public
 */
router.post("/login", async (req, res, next) => {
  try {
    // validate input
    const { error } = validateLogin(req.body);

    if (error) return res.status(404).json({ error: error.details[0].message });

    // find user if input is valid
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ error: "Invalid email!" });

    const isMatch = await comparePasswords(req.body.password, user.password);

    if (!isMatch) return res.status(404).json({ error: "Invalid password!" });

    // if passwords match, create payload and sign JWT token
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      posts: user.posts
    };

    const accessToken = jwt.sign(payload, config.jwt_secret, {
      expiresIn: 31556926 // 1 year
    });
    return res.status(200).json({ authenticated: true, token: accessToken });
  } catch (err) {
    next(err);
  }
});

/**
 *  Google login endpoint
 *  @route POST api/auth/googlelogin
 *  @desc Login user if they exist, if not, create new user and login
 *  @access Public
 */
router.post("/googlelogin", async (req, res, next) => {
  // Check whether user in db based on email
  try {
    const user = await User.findOne({ email: req.body.email });
    // if user in db...
    // send back success and token
    if (user)
      return res.status(200).json({ success: true, token: req.body.token });

    // if not, create user and send to save in database
    const userToBeCreated = {
      username: req.body.email,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    await User.create(userToBeCreated);
    return res.status(201).json({ success: true, token: req.body.token });
  } catch (err) {
    next(err);
  }
});

export default router;
