import express from "express";
import { User } from "./../db/models";
import passport from "passport";
const router = express.Router();

/**
 * Get all admins endpoint
 * @route GET /api/users/admins
 * @desc get admins
 * @access Public
 */
router.get("/admins", async (req, res, next) => {
  try {
    const admins = await User.find({ isAdmin: true });
    return res.status(200).json(admins);
  } catch (err) {
    next(err);
  }
});

/**
 * Get all Users endpoint
 * @route GET /api/users/
 * @desc get users
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * Get specifi User by id endpoint
 * @route GET /api/users/:id
 * @desc get user
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    return res.status(200).json(targetUser);
  } catch (err) {
    next(err);
  }
});

/**
 * Get specific User by email
 * @route GET /api/users/user/:email
 * @desc get user
 * @access Public
 */
router.get("/user/:email", async (req, res, next) => {
  try {
    const targetUser = await User.findOne({ email: req.params.email });
    return res.status(200).json(targetUser);
  } catch (err) {
    next(err);
  }
});

// passport check example for reference
/**
 * Get user after using jwt strategy
 * @route GET /api/users/auth/user
 * @desc get user
 * @access Protected
 */
router.get(
  "/auth/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).json({ authenticated: true, user: req.user });
  }
);

export default router;
