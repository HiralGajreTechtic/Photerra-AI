const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const apiKey = process.env.GOOGLE_API_KEY;
const fs = require("fs");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
class GoogleAPIService {
  static async getData(req) {
    try {
      // const url = "https://places.googleapis.com/v1/places:searchText";
      // const detailsUrl =
      //   "https://maps.googleapis.com/maps/api/place/details/json"; //get name

      // const requestData = {
      //   textQuery: req.query.query,
      // };

      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     "X-Goog-Api-Key": apiKey,
      //     "X-Goog-FieldMask": "places,nextPageToken",
      //   },
      // };

      // let response = await axios.post(url, requestData, config);
      // console.log("response==", response.data);
      // if (response) {
      //   for (let i in response.data.places) {
      //     let nameResponse = await axios.get(
      //       `${detailsUrl}?place_id=${response.data.places[i].id}&key=${apiKey}`
      //     );
      //     response.data.places[i].placeName = nameResponse.data.result.name;
      //     response.data.places[i].icon = nameResponse.data.result.icon;
      //   }
      //   response.data.results = response.data.places;
      //   delete response.data.places;
      // }

      const query = req.query.query;

      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;

      if (query) {
        url = url + `&query=${decodeURIComponent(query)}`;
      }
      if (req.query.pagetoken) {
        url = url + `&pagetoken=${req.query.pagetoken}`;
      }
      url = url + `&key=${apiKey}`;
      let response = await axios.get(url);

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  // Load the MobileNet model
  static async loadModel() {
    try {
      const model = await mobilenet.load();
      return model;
    } catch (error) {
      throw error;
    }
  }

  static async classifyImage(filePath, model) {
    try {
      const image = tf.node.decodeImage(fs.readFileSync(filePath));
      const predictions = await model.classify(image);
      return predictions;
    } catch (error) {
      throw error;
    }
  }

  static async insertUpdateData(payload) {
    try {
      let insertionData = [];
      const filePaths = [];
      let address_components, fileName;

      for (let i in payload) {
        //get the address components
        let nameResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${payload[i].place_id}&key=${apiKey}`
        );
        address_components = nameResponse.data.result.address_components;

        if (payload[i].photos?.length > 0) {
          //get the photos
          const apiUrl = "https://maps.googleapis.com/maps/api/place/photo";
          const params = {
            maxwidth: 400,
            photoreference: payload[i].photos[0].photo_reference,
            key: apiKey,
          };
          const imageResponse = await axios.get(apiUrl, {
            params,
            responseType: "stream",
          });

          if (imageResponse) {
            const publicDirectory = path.join(__dirname, "..", "public");
            const imagesDirectory = path.join(publicDirectory, "images");
            // Define the file path for the image
            fileName = `${payload[i].place_id}.jpg`;

            // Construct the file path
            const filePath = path.join(imagesDirectory, fileName);

            // Check if the file exists
            // if (fs.existsSync(filePath)) {
            //   // If the file exists, delete it
            //   await fs.unlink(filePath, async (error) => {
            //     if (error) {
            //       console.error("Error deleting the existing image:", error);
            //     } else {
            //       const fileStream = await fs.createWriteStream(filePath);
            //       imageResponse.data.pipe(fileStream);
            //     }
            //   });
            // } else {
            //   const fileStream = await fs.createWriteStream(filePath);
            //   imageResponse.data.pipe(fileStream);
            // }

            // const imagePath = filePath;
            // const model = await this.loadModel();
            // const predictions = await this.classifyImage(imagePath, model);
            // console.log("predictions==", predictions);
          }
        }

        let placeExists = await googlePlaceModel.find({
          "geometry.location.lng": payload[i].geometry.location.lng,
          "geometry.location.lat": payload[i].geometry.location.lat,
          name: payload[i].name,
        });
        console.log("placeExists-", placeExists);
        if (placeExists.length <= 0) {
          insertionData.push({
            ...payload[i],
            image: `/image/${fileName}`,
            address_components: address_components,
          });
        } else {
          let place_id = placeExists[0]._id;
          await googlePlaceModel.updateOne(
            { _id: place_id },
            {
              $set: {
                formatted_address: payload[i].formatted_address,
                icon: payload[i].icon,
                photos: payload[i].photos,
                place_id: payload[i].place_id,
                plus_code: payload[i].plus_code,
                rating: payload[i].rating,
                types: payload[i].types,
                user_ratings_total: payload[i].user_ratings_total,
                image: `/image/${fileName}`,
                address_components: address_components,
                updatedAt: new Date(),
              },
            }
          );
        }
      }
      if (insertionData.length > 0) {
        return await googlePlaceModel.insertMany(insertionData);
      } else {
        return true;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search;
      const regexPattern = new RegExp(search.slice(1, -1), "i");
      let placeExists = await googlePlaceModel.find({
        $expr: { $regexMatch: { input: "name", regex: regexPattern } },
      });
      return placeExists;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = GoogleAPIService;
