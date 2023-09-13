const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    heading: {type: String, required: true},
    description: {type: String, required: true },
    url: {type: String, required: true },
    imagePath: {type: String, required: true},
    logoPath: {type: String, required: true}
});

module.exports = mongoose.model('Banners', bannerSchema);