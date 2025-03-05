const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Get all comments" });
});

router.route("/").post((req, res) => {
  res.status(200).json({ message: "Create comment" });
});

router.route("/:id").get((req, res) => {
  res.status(200).json({ message: `Get comment for ${req.params.id}` });
});

router.route("/:id").put((req, res) => {
  res.status(200).json({ message: `Update comment for ${req.params.id}` });
});

router.route("/:id").delete((req, res) => {
  res.status(200).json({ message: `Delete comment for ${req.params.id}` });
});

module.exports = router;
