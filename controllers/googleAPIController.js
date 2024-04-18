const GoogleAPIService = require("../services/googleAPIService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class GoogleAPIController {
  static async getData(req, res) {
    try {
      console.log("entered");
      const data = await GoogleAPIService.getData();
      console.log("data=", data);
      util.setSuccess(200, "loged in successfully", data);
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error`);
    }
  }
}
module.exports = GoogleAPIController;
