const searchPlacesService = require("../services/searchPlacesService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class SearchPlacesController {
  static async getPlacesBySearch(req, res) {
    try {
      if (!req.query.search) {
        util.setError(400, "Please provide search keyword!`");
        return util.send(res);
      }
      const data = await searchPlacesService.getPlacesBySearch(req);

      util.setSuccess(200, "Data displayed successfully!", data);
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error while displaying data: ${error}`);
      return util.send(res);
    }
  }
}
module.exports = SearchPlacesController;
