const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.route("/").get(getComments);

router.route("/").post(createComment);

router.route("/:id").get(getComment);

router.route("/:id").put(updateComment);

router.route("/:id").delete(deleteComment);

module.exports = router;
