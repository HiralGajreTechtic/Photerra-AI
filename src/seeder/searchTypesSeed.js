const db = require("../config/db"); // Require the database connection
const SearchTypesModel = require("../models/searchTypesModel");

async function seedData() {
  try {
    const data = [
      { name: "Amusement Park", type: "amusement_park" },
      { name: "Aquarium", type: "aquarium" },
      { name: "Art Gallery", type: "art_gallery" },
      { name: "ATM", type: "atm" },
      { name: "Bakery", type: "bakery" },
      { name: "Bar", type: "bar" },
      { name: "Bus Station", type: "bus_station" },
      { name: "Cafe", type: "cafe" },
      { name: "Campground", type: "campground" },
      { name: "Car Dealer", type: "car_dealer" },
      { name: "Car Rental", type: "car_rental" },
      { name: "Car Repair", type: "car_repair" },
      { name: "Car Wash", type: "car_wash" },
      { name: "Casino", type: "casino" },
      { name: "Church", type: "church" },
      { name: "City Hall", type: "city_hall" },
      { name: "Hindu Temple", type: "hindu_temple" },
      { name: "Light Rail Station", type: "light_rail_station" },
      { name: "Liquor Store", type: "liquor_store" },
      { name: "Local Government Office", type: "local_government_office" },
      { name: "Lodging", type: "lodging" },
      { name: "Meal Delivery", type: "meal_delivery" },
      { name: "Meal Takeaway", type: "meal_takeaway" },
      { name: "Mosque", type: "mosque" },
      { name: "Movie Theater", type: "movie_theater" },
      { name: "Museum", type: "museum" },
      { name: "Night Club", type: "night_club" },
      { name: "Park", type: "park" },
      { name: "Parking", type: "parking" },
      { name: "Restaurant", type: "restaurant" },
      { name: "RV Park", type: "rv_park" },
      { name: "Shopping Mall", type: "shopping_mall" },
      { name: "Spa", type: "spa" },
      { name: "Stadium", type: "stadium" },
      { name: "Subway Station", type: "subway_station" },
      { name: "Supermarket", type: "supermarket" },
      { name: "Taxi Stand", type: "taxi_stand" },
      { name: "Tourist Attraction", type: "tourist_attraction" },
      { name: "Train Station", type: "train_station" },
      { name: "Zoo", type: "zoo" },
    ];

    await db.mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await SearchTypesModel.deleteMany();

    // Insert new data
    await SearchTypesModel.insertMany(data);

    console.log("Data seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    // Close the connection after seeding
    await db.mongoose.connection.close();
  }
}

seedData();
