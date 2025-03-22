const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
  registerUser,
  loginUser,
  currentUser,
  refreshToken,
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/refresh-token", validateToken, refreshToken);

module.exports = router;
