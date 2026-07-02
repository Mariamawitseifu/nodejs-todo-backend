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

const { authCheck } = require("../middleware");
const fcmController = require("../controllers/fcm.controller");

// Set up the FCM token endpoint
router.post("/fcm-token", [authCheck.verifyToken], fcmController.updateToken);

module.exports = router;
