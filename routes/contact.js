const express = require("express");
const Contact = require("../models/contact");
const router = express.Router();

router.put("/:id", (req, res, next) => {
  const bannerId = req.params.id;

  const updatedContact = {
    address1: req.body.address1,
    address2: req.body.address2,
    address3: req.body.address3,
    number1: req.body.number1,
    number2: req.body.number2,
    number3: req.body.number3,
    email1: req.body.email1,
    email2: req.body.email2,
    about: req.body.about,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    linkedin: req.body.linkedin,
  };

  Contact.findByIdAndUpdate(bannerId, updatedContact, { new: true })
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res
        .status(200)
        .json({ message: "Data updated successfully", banner: updatedContact });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("", (req, res, next) => {
  Contact.find().then((data) => {
    res.status(200).json({ contact: data });
  });
});

module.exports = router;
