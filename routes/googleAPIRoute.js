const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const GoogleAPIController = require("../controllers/googleAPIController");
const verifyToken = require("../middleware/auth");

router.get(
  "/",
  verifyToken.authenticate("jwt", { session: false }),
  GoogleAPIController.getData
);
router.post(
  "/",
  verifyToken.authenticate("jwt", { session: false }),
  GoogleAPIController.insertData
);

module.exports = router;
