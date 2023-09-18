const mongoose = require("mongoose");

const contactSeoSchema = mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  keyword: { type: String, required: true },
});

module.exports = mongoose.model("ContactSeo", contactSeoSchema);
