const express = require("express");
const CareerSeo = require('../models/careerseo');
const router = express.Router();

router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedCareerSeo = {
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    };

    CareerSeo.findByIdAndUpdate(bannerId, updatedCareerSeo, { new: true })
      .then((updatedCareerSeo) => {
        if (!updatedCareerSeo) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedCareerSeo);
        res.status(200).json({ message: "Data updated successfully", banner: updatedCareerSeo });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  CareerSeo.find().then((data) => {
    res.status(200).json({ seo: data });
  });
});



module.exports = router;
