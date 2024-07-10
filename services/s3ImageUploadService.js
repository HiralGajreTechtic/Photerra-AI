const googlePlaceModel = require("../src/models/googlePlacesModel");
const apiKey = process.env.GOOGLE_API_KEY;
const axios = require("axios");

class ImageS3UploadService {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  });
  static async uploadImage(image, subdomain, isBase64 = false) {
    try {
      let params;
      let sanitizedFileName = "",
        imagePath = "";

      if (isBase64) {
        const base64Data = Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const type = image.split(";")[0].split("/")[1];
        imagePath = `${subdomain}${new Date().getTime() + "." + type}`;
        params = {
          Bucket: process.env.AWS_S3_POST_BUCKET,
          Key: imagePath,
          Body: base64Data,
          ContentType: `image/${type}`,
          ContentEncoding: "base64",
          ContentDisposition: "inline",
        };
      } else {
        sanitizedFileName = image.originalname.replace(/ /g, "_");
        imagePath = `${subdomain}${
          new Date().getTime() + "-" + sanitizedFileName
        }`;
        params = {
          Bucket: process.env.AWS_S3_POST_BUCKET,
          Key: imagePath,
          Body: image.buffer,
          ContentType: image.mimetype,
          ContentDisposition: "inline",
        };
      }

      let resp = await this.s3.upload(params).promise();
      return resp?.Location;
    } catch (error) {
      console.log("error in uploadImage s3--", error);
      throw new Error(error);
    }
  }
}

module.exports = ImageS3UploadService;
