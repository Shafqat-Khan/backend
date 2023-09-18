const mongoose = require("mongoose");

const oxygenSeoSchema = mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  keyword: { type: String, required: true },
});

module.exports = mongoose.model("OxygenSeo", oxygenSeoSchema);
