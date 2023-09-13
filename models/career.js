const mongoose = require("mongoose");

const careerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  position: { type: String, required: true },
  pdfPath: { type: String, required: true },
});

module.exports = mongoose.model("Career", careerSchema);
