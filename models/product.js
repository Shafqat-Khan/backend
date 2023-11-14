const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  heading: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
