const SearchTypesModel = require("../src/models/searchTypesModel");

class SearchTypesService {
  static async getSearchTypes() {
    try {
      const result = await SearchTypesModel.find({});
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = SearchTypesService;
