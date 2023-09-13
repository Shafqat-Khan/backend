const mongoose = require("mongoose");

const contantSchema = mongoose.Schema({
  heading: { type: String, required: true },
  contant: { type: String, required: true },
  text1: { type: String, required: true },
  text2: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Contant", contantSchema);
