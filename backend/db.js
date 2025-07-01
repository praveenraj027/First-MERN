const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectToMongo;