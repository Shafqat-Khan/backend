const express = require("express");
const ContactSeo = require("../models/contactseo");
const router = express.Router();

router.post("", (req, res, next) => {
  try {
    const seos = new ContactSeo({
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
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/:id",

  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedContactSeo = {
      title: req.body.title,
      url: req.body.url,
      heading: req.body.heading,
      description: req.body.description,
      keyword: req.body.keyword,
    };

    ContactSeo.findByIdAndUpdate(bannerId, updatedContactSeo, { new: true })
      .then((updatedContactSeo) => {
        if (!updatedContactSeo) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedContactSeo);
        res.status(200).json({
          message: "Data updated successfully",
          banner: updatedContactSeo,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  try {
    ContactSeo.find().then((data) => {
      res.status(200).json({ seo: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
