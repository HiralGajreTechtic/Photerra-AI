const express = require("express");
const router = express.Router();
const GoogleAPIController = require("../controllers/googleAPIController");

router.get("/", GoogleAPIController.getData);

module.exports = router;
