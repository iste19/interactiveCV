const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");

//@desc Get all comments
//@route GET /api/comments
//@access private
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ user_id: req.user.id });
  res.status(200).json(comments);
});

//@desc Create new comments
//@route POST /api/comments
//@access private
const createComment = asyncHandler(async (req, res) => {
  console.log("The request body is", req.body);
  const { sectionHeading, comment, extraInfo, position, userId } = req.body;
  if (!comment || !position) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const newComment = await Comment.create({
    sectionHeading,
    comment,
    extraInfo,
    position,
    user_id: req.user.id,
  });
  res.status(201).json(newComment);
});

//@desc Get contact
//@route GET /api/comments/:id
//@access private
const getComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json(comment);
});

//@desc Update comment
//@route PUT /api/comments/:id
//@access private
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user comments");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedComment);
});

//@desc Delete comment (only admins can for now in frontend)
//@route DELETE /api/comments/:id
//@access private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (req.user.role !== "admin" && comment.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user comments");
  }

  await Comment.findByIdAndDelete(req.params.id);
  res.status(200).json(comment);
});

//@desc Delete all comments (only admins can)
//@route DELETE /api/comments/all
//@access private
const deleteAllComments = asyncHandler(async (req, res) => {
  const result = await Comment.deleteMany({});
  res.json({ message: `Deleted ${result.deletedCount} comments` });
});

//@desc Get all comments (Admin only)
//@route GET /api/comments/admin
//@access private
const getAllCommentsForAdmin = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user_id", "username email");
  res.status(200).json(comments);
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  getComment,
  deleteComment,
  deleteAllComments,
  getAllCommentsForAdmin,
};
