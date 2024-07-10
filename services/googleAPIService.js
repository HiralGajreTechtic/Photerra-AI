const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const apiKey = process.env.GOOGLE_API_KEY;
const fs = require("fs");
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const AWS = require("aws-sdk");
const mime = require("mime-types");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});
class GoogleAPIService {
  static async getData(req) {
    try {
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
      //give the catgeories to AI and it will find the category as per image
      let insertionData = [];
      let address_components,
        fileName,
        mimetype = "",
        imageName = "";

      for (let i in payload) {
        //get the address components
        let nameResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${payload[i].place_id}&key=${apiKey}`
        );
        address_components = nameResponse.data.result.address_components;

        if (payload[i].photos?.length > 0) {
          //get the photos
          const apiUrl = "https://maps.googleapis.com/maps/api/place/photo";
          let params = {
            maxwidth: 400,
            photoreference: payload[i].photos[0].photo_reference,
            key: apiKey,
          };
          let imageResponse = await axios.get(apiUrl, {
            params,
            responseType: "arraybuffer",
          });

          if (imageResponse) {
            let buffer = Buffer.from(imageResponse.data, "binary");
            let mimeType = imageResponse.headers["content-type"];
            if (!mimeType) {
              mimeType = mime.lookup(url);
            }
            fileName = `${payload[i].place_id}.jpg`;

            let imagePath = `googlePlacesImages/${
              new Date().getTime() + "-" + fileName
            }`;
            let s3params = {
              Bucket: process.env.AWS_S3_POST_BUCKET,
              Key: imagePath,
              Body: buffer,
              ContentType: mimetype,
              ContentDisposition: "inline",
            };
            let resp = await s3.upload(s3params).promise();
            imageName = resp?.Location;
          }
        }

        let placeExists = await googlePlaceModel.find({
          "geometry.location.lng": payload[i].geometry.location.lng,
          "geometry.location.lat": payload[i].geometry.location.lat,
          name: payload[i].name,
        });
        if (placeExists.length <= 0) {
          insertionData.push({
            ...payload[i],
            image: imageName,
            address_components: address_components,
          });
        } else {
          let place_id = placeExists[0]._id;
          if (
            placeExists[0].icon.includes(
              "https://photerra-app-images.s3.amazonaws.com/"
            )
          ) {
            const deleteParams = {
              Bucket: process.env.AWS_S3_POST_BUCKET,
              Key: placeExists[0].icon.split(
                "https://photerra-app-images.s3.amazonaws.com/"
              )[1],
            };
            await s3.deleteObject(deleteParams).promise();
          }
          if (
            placeExists[0].image.includes(
              "https://photerra-app-images.s3.amazonaws.com/"
            )
          ) {
            const deleteParams = {
              Bucket: process.env.AWS_S3_POST_BUCKET,
              Key: placeExists[0].image.split(
                "https://photerra-app-images.s3.amazonaws.com/"
              )[1],
            };
            await s3.deleteObject(deleteParams).promise();
          }

          await googlePlaceModel.updateOne(
            { _id: place_id },
            {
              $set: {
                formatted_address: payload[i].formatted_address,
                icon: imageName,
                photos: payload[i].photos,
                place_id: payload[i].place_id,
                plus_code: payload[i].plus_code,
                rating: payload[i].rating,
                types: payload[i].types,
                user_ratings_total: payload[i].user_ratings_total,
                image: imageName,
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
