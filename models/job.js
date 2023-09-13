const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Job", jobSchema);
