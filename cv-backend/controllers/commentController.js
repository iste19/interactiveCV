const asyncHandler = require("express-async-handler");
//@desc Get all comments
//@route GET /api/comments
//@access public
const getComments = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get all comments" });
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
  res.status(201).json({ message: "Create comment" });
});

//@desc Get contact
//@route GET /api/comments/:id
//@access public
const getComment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Get comment for ${req.params.id}` });
});

//@desc Update comment
//@route PUT /api/comments/:id
//@access public
const updateComment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update comment for ${req.params.id}` });
});

//@desc Delete comment
//@route DELETE /api/comments/:id
//@access public
const deleteComment = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete comment for ${req.params.id}` });
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  getComment,
  deleteComment,
};
