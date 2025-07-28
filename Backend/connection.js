const mongoose = require("mongoose");

async function connectToMongoose(url) {
  return await mongoose.connect(url);
}

module.exports = { connectToMongoose };
