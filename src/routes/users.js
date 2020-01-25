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
 * @route GET /api/users/:email
 * @desc get user
 * @access Public
 */
router.get("/:email", async (req, res, next) => {
  try {
    const targetUser = await User.findOne({ email: req.params.email });
    return res.status(200).json(targetUser);
  } catch (err) {
    next(err);
  }
});

// passport check example for reference
router.get("/authUser", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return res.status(403).json({ error: err });

    if (info) {
      res.status(400).json({ error: info.message });
    } else {
      return res.status(200).json({
        authenticated: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          email: user.email,
          username: user.username
        }
      });
    }
  })(req, res, next);
});

export default router;
