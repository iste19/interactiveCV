const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  deleteAllComments,
  getAllCommentsForAdmin,
} = require("../controllers/commentController");
const validateToken = require("../middleware/validateTokenHandler");
const roleAuthorization = require("../middleware/roleAuthorization");

router.use(validateToken);
router.route("/").post(createComment).get(getComments);
router.route("/admin").get(roleAuthorization("admin"), getAllCommentsForAdmin);
router.route("/all").delete(roleAuthorization("admin"), deleteAllComments);
router
  .route("/:id")
  .get(getComment)
  .put(updateComment)
  .delete(roleAuthorization("admin"), deleteComment);

module.exports = router;
