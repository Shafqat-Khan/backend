const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  heading: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Client", clientSchema);
