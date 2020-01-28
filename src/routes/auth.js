import { Router } from "express";
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

const router = Router();

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

    if (!isMatch)
      return res.status(404).json({ error: "Password and email do not match" });

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
      expiresIn: 1200000 // 20 min
    });

    const refreshToken = jwt.sign(payload, config.refresh_secret);

    // update User's refresh token in db
    await User.findOneAndUpdate(
      { email: user.email },
      { refreshToken: refreshToken }
    );

    return res.status(200).json({
      authenticated: true,
      token: accessToken,
      refreshToken: refreshToken
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Token endpoint
 * @route POST api/auth/token
 * @desc Refresh a user's token
 * @access Public
 */
router.post("/token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken || refreshToken === "") return res.sendStatus(401);

    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) return res.sendStatus(403);

    // verify refresh token
    jwt.verify(refreshToken, config.refresh_secret, (err, user) => {
      if (err) return res.sendStatus(403);

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        posts: user.posts
      };
      const accessToken = jwt.sign(payload, config.jwt_secret, {
        expiresIn: 900000 // 15 min
      });
      // send newly made token to user
      return res.status(200).json({ newToken: accessToken });
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Reject token endpoint
 * @route POST api/auth/token/reject
 * @desc remove a user's refresh token
 * @access Public
 */
router.put("/token/reject", async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { refreshToken: "" }
    );

    return res
      .status(200)
      .json({ message: "refresh token successfully removed!" });
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
    // create user and send to save in database
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
