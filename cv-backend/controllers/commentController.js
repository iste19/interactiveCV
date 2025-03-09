const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");

//@desc Get all comments
//@route GET /api/comments
//@access public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find();
  res.status(200).json(comments);
});

//@desc Create new comments
//@route POST /api/comments
//@access public
const createComment = asyncHandler(async (req, res) => {
  console.log("The request body is", req.body);
  const { sectionHeading, comment, extraInfo, position, userId } = req.body;
  if (!comment || !position || !userId) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const newComment = await Comment.create({
    sectionHeading,
    comment,
    extraInfo,
    position,
    userId,
  });
  res.status(201).json(newComment);
});

//@desc Get contact
//@route GET /api/comments/:id
//@access public
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
//@access public
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedComment);
});

//@desc Delete comment
//@route DELETE /api/comments/:id
//@access public
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.status(200).json(comment);
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  getComment,
  deleteComment,
};
