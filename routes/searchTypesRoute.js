const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const SearchTypesController = require("../controllers/searchTypesController");
const verifyToken = require("../middleware/auth");

router.get(
  "/",
  verifyToken.authenticate("jwt", { session: false }),
  SearchTypesController.getSearchTypes
);

module.exports = router;
