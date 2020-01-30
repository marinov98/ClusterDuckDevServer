import { Router } from "express";
import { Post, Reply } from "./../db/models";
import { checkAdmin } from "./../middleware/authorize";

const router = Router();

/**
 * @desc Get a Post's comments endpoint
 * @route GET /api/replies/:postId
 * @access Public
 */
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("replies");

    return res.status(200).json(post.replies);
  } catch (err) {
    next(err);
  }
});

/**
 * @desc make a new comment endpoint
 * @route POST /api/replies/
 * @access Public
 */
router.post("/", async (req, res, next) => {
  try {
    // create new reply
    const newReply = await Reply.create(req.body);
    await newReply.save();

    // grab post and update it
    const postToRecieveReply = await Post.findById(req.body.posterId);

    postToRecieveReply.replies.push(newReply);
    await postToRecieveReply.save();

    return res.status(200).json(newReply);
  } catch (err) {
    next(err);
  }
});

/**
 * @desc delete a comment
 * @route DELETE api/replies/:replyId
 * @access Restricted to admins
 */
router.delete("/:replyId", checkAdmin, async (req, res, next) => {
  try {
    // grab reply and post object
    const reply = await Reply.findById(req.params.replyId);
    const postOfReply = await Post.findById(reply.postId);

    // delete reply and update post
    await Reply.findByIdAndDelete(req.params.replyId);

    postOfReply.replies = postOfReply.replies.filter(
      id => id !== req.params.replyId
    );

    await postOfReply.save();

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
