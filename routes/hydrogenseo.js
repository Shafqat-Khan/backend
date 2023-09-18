const express = require("express");
const HydrogenSeo = require('../models/hydrogenseo');
const router = express.Router();

router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedHydrogenSeo = {
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    };

    HydrogenSeo.findByIdAndUpdate(bannerId, updatedHydrogenSeo, { new: true })
      .then((updatedHydrogenSeo) => {
        if (!updatedHydrogenSeo) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedHydrogenSeo);
        res.status(200).json({ message: "Data updated successfully", banner: updatedHydrogenSeo });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  HydrogenSeo.find().then((data) => {
    res.status(200).json({ seo: data });
  });
});



module.exports = router;
