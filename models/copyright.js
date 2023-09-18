const mongoose = require("mongoose");

const copyrightSchema = mongoose.Schema({
  text: { type: String, required: true },
});

module.exports = mongoose.model("Copyright", copyrightSchema);
