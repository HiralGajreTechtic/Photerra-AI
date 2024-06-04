const googlePlaceModel = require("../src/models/googlePlacesModel");
const apiKey = process.env.GOOGLE_API_KEY;
const axios = require("axios");
class SearchPlacesService {
  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regexPattern = new RegExp(`^${search}`, "i");

      let result = await googlePlaceModel.find({
        name: { $regex: regexPattern },
      });
      if (result?.length) {
        for (let i in result) {
          result[i].name = result[i].name;
        }
      } else {
        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key=${apiKey}`;
        let response = await axios.get(url);
        let searchResponse = response.data.predictions;
        for (let i in searchResponse) {
          let placeDetails = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${searchResponse[i].place_id}&key=${apiKey}`
          );

          result.push({
            _id: "",
            address_components: placeDetails.data.result.address_components,
            name: placeDetails.data.result.name,
            formatted_address: placeDetails.data.result.formatted_address,
            icon: placeDetails.data.result.icon
              ? placeDetails.data.result.icon
              : "",
            photos: placeDetails.data.result.photos
              ? placeDetails.data.result.photos
              : [],
            place_id: searchResponse[i].place_id,
            plus_code: {},
            geometry: placeDetails.data.result.geometry,
            rating: placeDetails.data.result.rating
              ? placeDetails.data.result.rating
              : 0,
            types: placeDetails.data.result.types,
            user_ratings_total: placeDetails.data.result.user_ratings_total
              ? placeDetails.data.result.user_ratings_total
              : 0,
            image: "",
            category_ids: [],
            tag_ids: [],
            updatedAt: null,
            insertedAt: "",
          });
        }
      }

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
      if (addressData?.length) {
        return addressData;
      } else {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.lat},${req.query.lng}&sensor=true&key=${apiKey}`;
        let response = await axios.get(url);
        let searchResponse = response.data;
        for (let i in searchResponse.results) {
          let placeDetails = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${searchResponse.results[i].place_id}&key=${apiKey}`
          );
          addressData.push({
            _id: "",
            address_components: placeDetails.data.result.address_components,
            name: placeDetails.data.result.name,
            formatted_address: placeDetails.data.result.formatted_address,
            icon: placeDetails.data.result.icon
              ? placeDetails.data.result.icon
              : "",
            photos: placeDetails.data.result.photos
              ? placeDetails.data.result.photos
              : [],
            place_id: searchResponse.results[i].place_id,
            plus_code: searchResponse.plus_code,
            geometry: placeDetails.data.result.geometry,
            rating: placeDetails.data.result.rating
              ? placeDetails.data.result.rating
              : 0,
            types: placeDetails.data.result.types,
            user_ratings_total: placeDetails.data.result.user_ratings_total
              ? placeDetails.data.result.user_ratings_total
              : 0,
            image: "",
            category_ids: [],
            tag_ids: [],
            updatedAt: null,
            insertedAt: "",
          });
        }
        return addressData;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = SearchPlacesService;
