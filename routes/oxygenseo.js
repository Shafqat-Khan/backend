const express = require("express");
const OxygenSeo = require('../models/oxygenseo');
const router = express.Router();

router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedOxygenSeo = {
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    };

    OxygenSeo.findByIdAndUpdate(bannerId, updatedOxygenSeo, { new: true })
      .then((updatedOxygenSeo) => {
        if (!updatedOxygenSeo) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedOxygenSeo);
        res.status(200).json({ message: "Data updated successfully", banner: updatedOxygenSeo });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  OxygenSeo.find().then((data) => {
    res.status(200).json({ seo: data });
  });
});



module.exports = router;