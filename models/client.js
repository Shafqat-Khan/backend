const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Client", clientSchema);
