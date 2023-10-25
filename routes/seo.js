const express = require("express");
const Seo = require('../models/seo');
const router = express.Router();

router.post("", (req, res, next) => {
  const seos = new Seo({
    title: req.body.title,
    url: req.body.url,
    heading: req.body.heading,
    description: req.body.description,
    keyword: req.body.keyword,
  });
  seos.save().then((createdQuote) => {
    res.status(201).json({
      message: "Data received successfully",
      banner: {
        ...createdQuote,
      },
    });
  });
});

router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedSeo = {
      title: req.body.title,
      url: req.body.url,
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    };

    Seo.findByIdAndUpdate(bannerId, updatedSeo, { new: true })
      .then((updatedSeo) => {
        if (!updatedSeo) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedSeo);
        res.status(200).json({ message: "Data updated successfully", banner: updatedSeo });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Seo.find().then((data) => {
    res.status(200).json({ seo: data });
  });
});



module.exports = router;
