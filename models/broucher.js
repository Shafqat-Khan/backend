const mongoose = require("mongoose");

const broucherSchema = mongoose.Schema({
  pdfPath: { type: String, required: true },
});

module.exports = mongoose.model("Broucher", broucherSchema);
