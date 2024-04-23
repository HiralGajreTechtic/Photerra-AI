const googlePlaceModel = require("../src/models/googlePlacesModel");
class SearchPlacesService {
  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regexPattern = new RegExp(`^${search}`, "i");

      const result = await googlePlaceModel.find({
        name: { $regex: regexPattern },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SearchPlacesService;
