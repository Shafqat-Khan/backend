const express = require("express");
const Seo = require('../models/seo');
const router = express.Router();

router.post(
  "",
  
  (req, res, next) => {
    console.log(req.body)

    const banners = new Seo({
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    });
    console.log(banners)
    banners.save().then((createdBanner) => {
      res.status(201).json({
        message: "Data received successfully",
        banner: {
          ...createdBanner,
        },
      });
    });
  }
);


router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedSeo = {
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

router.delete("/:id", (req, res, next) => {
  Seo.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
