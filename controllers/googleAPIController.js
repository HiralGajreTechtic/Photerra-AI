const GoogleAPIService = require("../services/googleAPIService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class GoogleAPIController {
  static async getData(req, res) {
    try {
      if (!req.query.place) {
        util.setError(400, "Please provide place name!`");
        return util.send(res);
      }
      const data = await GoogleAPIService.getData(req.query.place);
      console.log("data=", data);
      util.setSuccess(200, "Data displayed successfully!", data);
      return util.send(res);
    } catch (error) {
      return util.setError(500, `Error`);
    }
  }
}
module.exports = GoogleAPIController;
