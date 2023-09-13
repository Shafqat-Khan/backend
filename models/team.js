const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  twitter: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Team", teamSchema);
