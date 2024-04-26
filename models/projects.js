const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productTitle: { type: String, required: true },
  category: { type: String },
  heading: { type: String, required: true },
  productUrl: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: [String], required: true },
  youtubeUrls: { type: [String] },
  pageTitle: { type: String, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keyword: { type: String, required: true },
});

module.exports = mongoose.model("Projects", productSchema);
