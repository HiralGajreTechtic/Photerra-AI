const searchPlacesService = require("../services/searchPlacesService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class SearchPlacesController {
  static async getPlacesBySearch(req, res) {
    try {
      if (!req.query.search) {
        util.setSuccess(200, "Data displayed successfully!", []);
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

  static async getAddressByLatLng(req, res) {
    try {
      if (!req.query.lat) {
        util.setError(400, "Please provide latitude!`");
        return util.send(res);
      }
      if (!req.query.lng) {
        util.setError(400, "Please provide longitude!`");
        return util.send(res);
      }
      const data = await searchPlacesService.getAddressByLatLng(req);

      util.setSuccess(200, "Data displayed successfully!", data);
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error while displaying data: ${error}`);
      return util.send(res);
    }
  }
}
module.exports = SearchPlacesController;
