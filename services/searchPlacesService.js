const googlePlaceModel = require("../src/models/googlePlacesModel");
class SearchPlacesService {
  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regexPattern = new RegExp(`^${search}`, "i");
      console.log("regexPattern=", regexPattern);
      const result = await googlePlaceModel.find({
        name: { $regex: regexPattern },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getAddressByLatLng(req) {
    try {
      let addressData = await googlePlaceModel.find({
        "geometry.location.lng": parseFloat(req.query.lng),
        "geometry.location.lat": parseFloat(req.query.lat),
      });
      return addressData;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = SearchPlacesService;
