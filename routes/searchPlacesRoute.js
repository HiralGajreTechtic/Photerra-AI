const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const SearchPlacesController = require("../controllers/searchPlacesController");
// const verifyToken = require("../middleware/auth");

// router.use(verifyToken);
router.get("/searchByKeyword", SearchPlacesController.getPlacesBySearch);
router.get("/getAddressByLatLng", SearchPlacesController.getAddressByLatLng);

module.exports = router;
