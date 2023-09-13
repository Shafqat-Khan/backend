const mongoose = require("mongoose");

const aboutSchema = mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("About", aboutSchema);
