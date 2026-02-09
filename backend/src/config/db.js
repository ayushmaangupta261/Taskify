const mongoose = require("mongoose");

// Connects the application to MongoDB
module.exports = async () => {
 
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");
};
