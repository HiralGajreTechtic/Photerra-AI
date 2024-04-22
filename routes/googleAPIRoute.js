const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const GoogleAPIController = require("../controllers/googleAPIController");
// const verifyToken = require("../middleware/auth");

// router.use(verifyToken);
router.get("/", GoogleAPIController.getData);
router.post("/", GoogleAPIController.insertData);

module.exports = router;
