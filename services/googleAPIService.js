const database = require("../src/config/db");
const testModel = require("../src/models/testModel");

class GoogleAPIService {
  static async getData() {
    try {
      const data = await testModel.find();
      console.log("data=", data);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GoogleAPIService;
