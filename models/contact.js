const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  address3: { type: String, required: true },
  number1: { type: String, required: true },
  number2: { type: String, required: true },
  number3: { type: String, required: true },
  email1: { type: String, required: true },
  email2: { type: String, required: true },
  about: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  twitter: { type: String, required: true },
  linkedin: { type: String, required: true },
});

module.exports = mongoose.model("Contact", contactSchema);
