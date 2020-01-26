// posts routes
import express from "express";
import mongoose from "mongoose";
import { User, Post } from "./../db/models";
const router = express.Router();

/**
 *
 *
 * POST
 *
 *
 *
 */

/**
 * CreatePost endpoint
 * @route POST /api/posts
 * @desc Create a post
 * @access Public
 */
router.post("/", async (req, res, next) => {
  try {
    // create new post
    const newPost = await Post.create(req.body);
    await newPost.save();

    // grab owner of post and update them
    const userWhoPosted = await User.findById(req.body.userId);

    userWhoPosted.posts.push(newPost);
    await userWhoPosted.save();

    return res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

/**
 * FindAllPosts endpoint
 * @route GET api/posts
 * Find all posts
 * @access Public
 */
router.get("/", async (req, res, next) => {
  try {
    const allPosts = await Post.find().sort({ created: "desc" });
    return res.status(200).json(allPosts);
  } catch (err) {
    next(err);
  }
});

/**
 * FindAllPosts with related CS topic endpoint
 * @route GET api/posts/topics/:topic
 * Find all posts
 * @access Public
 */
router.get("/topics/:topic", async (req, res, next) => {
  try {
    const targetPosts = await Post.find({ csTopic: req.params.topic });
    return res.status(200).json(targetPosts);
  } catch (err) {
    next(err);
  }
});

/**
 * Get Single Post endpoint
 * @route GET api/posts/:id
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * Get Single Post endpoint by the user id
 * @route GET api/posts/user/:userId
 * @access Public
 */
router.get("/user/:userId", async (req, res, next) => {
  try {
    const post = await Post.findOne({ poster: req.params.userId });
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * DeletePost endpoint
 * @route DELETE api/posts/:id
 * @desc Delete a post
 * @access Public
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/**
 *
 * POST LIKE AND DISLIKE
 *
 */

/**
 * like Post endpoint
 * @route POST api/posts/:id/:userId/like
 * @desc like a post
 * @access Public
 */
router.post("/:id/:userId/like", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.params.userId);
    const user_id = new mongoose.Types.ObjectId(user.id);
    const found = post.upVotes.find(function(element) {
      return element.toString() === user_id.toString();
    });
    if (found) {
      post.upVotes = post.upVotes.filter(function(element) {
        return !(element.toString() === user_id.toString());
      });
    } else {
      post.upVotes.push(user_id);
      post.downVotes = post.downVotes.filter(function(element) {
        return !(element.toString() === user_id.toString());
      });
    }
    post.save();
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * dislike Post endpoint
 * @route POST api/posts/:id/:userId/dislike
 * @desc dislike a post
 * @access Public
 */
router.post("/:id/:userId/dislike", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.params.userId);
    const user_id = new mongoose.Types.ObjectId(user.id);
    const found = post.downVotes.find(function(element) {
      return element.toString() === user_id.toString();
    });
    if (found) {
      post.downVotes = post.downVotes.filter(function(element) {
        return !(element.toString() === user_id.toString());
      });
    } else {
      post.downVotes.push(user_id);
      post.upVotes = post.upVotes.filter(function(element) {
        return !(element.toString() === user_id.toString());
      });
    }
    post.save();
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

export default router;
