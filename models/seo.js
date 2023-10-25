const mongoose = require("mongoose");

const seoSchema = mongoose.Schema({
  title: { type: String, title: true },
  url: { type: String, url: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  keyword: { type: String, required: true },
});

module.exports = mongoose.model("Seo", seoSchema);
