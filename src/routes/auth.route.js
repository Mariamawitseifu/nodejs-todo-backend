const express = require("express");
const router = express.Router();
const { userCheck } = require("../middleware");
const controller = require("../controllers/auth.controller");

// returns token
router.post("/login", controller.login);

router.post(
  "/register",
  [userCheck.checkDuplicateUsernameOrEmail],
  controller.register
);

module.exports = router;
