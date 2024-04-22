const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const SearchPlacesController = require("../controllers/searchPlacesController");
// const verifyToken = require("../middleware/auth");

// router.use(verifyToken);
router.get("/", SearchPlacesController.getPlacesBySearch);

module.exports = router;
