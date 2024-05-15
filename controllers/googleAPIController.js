const GoogleAPIService = require("../services/googleAPIService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class GoogleAPIController {
  static async getData(req, res) {
    try {
      // if (!req.query.place) {
      //   util.setError(400, "Please provide place name!`");
      //   return util.send(res);
      // }
      const data = await GoogleAPIService.getData(req);

      util.setSuccess(200, "Data displayed successfully!", data);
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error while displaying data: ${error}`);
      return util.send(res);
    }
  }

  static async insertData(req, res) {
    try {
      GoogleAPIService.insertUpdateData(req.body);
      util.setSuccess(200, "Data inserted successfully!");
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error while inserting data: ${error}`);
      return util.send(res);
    }
  }
}
module.exports = GoogleAPIController;
