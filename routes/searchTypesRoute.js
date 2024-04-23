const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
const SearchTypesController = require("../controllers/searchTypesController");
// const verifyToken = require("../middleware/auth");

// router.use(verifyToken);
router.get("/", SearchTypesController.getSearchTypes);

module.exports = router;
