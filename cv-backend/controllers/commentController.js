//@desc Get all comments
//@route GET /api/comments
//@access public
const getComments = (req, res) => {
  res.status(200).json({ message: "Get all comments" });
};

//@desc Create new comments
//@route POST /api/comments
//@access public
const createComment = (req, res) => {
  res.status(201).json({ message: "Create comment" });
};

//@desc Get contact
//@route GET /api/comments/:id
//@access public
const getComment = (req, res) => {
  res.status(200).json({ message: `Get comment for ${req.params.id}` });
};

//@desc Update comment
//@route PUT /api/comments/:id
//@access public
const updateComment = (req, res) => {
  res.status(200).json({ message: `Update comment for ${req.params.id}` });
};

//@desc Delete comment
//@route DELETE /api/comments/:id
//@access public
const deleteComment = (req, res) => {
  res.status(200).json({ message: `Delete comment for ${req.params.id}` });
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  getComment,
  deleteComment,
};
