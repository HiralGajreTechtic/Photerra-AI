const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const SearchPlacesController = require("../controllers/searchPlacesController");
const verifyToken = require("../middleware/auth");

router.get(
  "/searchByKeyword",
  verifyToken.authenticate("jwt", { session: false }),
  SearchPlacesController.getPlacesBySearch
);
router.get(
  "/getAddressByLatLng",
  verifyToken.authenticate("jwt", { session: false }),
  SearchPlacesController.getAddressByLatLng
);

module.exports = router;
