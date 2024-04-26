const mongoose = require("mongoose");

const Images3dSchema = mongoose.Schema({
  heading: { type: String, required: true },
  product: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Images3d", Images3dSchema);
