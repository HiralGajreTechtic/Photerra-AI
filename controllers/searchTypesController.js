const SearchTypesService = require("../services/searchTypesService");
const Util = require("../src/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class SearchTypesController {
  static async getSearchTypes(req, res) {
    try {
      const data = await SearchTypesService.getSearchTypes();
      util.setSuccess(200, "Data displayed successfully!", data);
      return util.send(res);
    } catch (error) {
      util.setError(500, `Error while displaying data: ${error}`);
      return util.send(res);
    }
  }
}
module.exports = SearchTypesController;
