const express = require("express");
const Contact = require("../models/contact");
const router = express.Router();

router.post("", (req, res, next) => {
  try {
    const contact = new Contact({
      address1: req.body.address1,
      address2: req.body.address2,
      address3: req.body.address3,
      number1: req.body.number1,
      number2: req.body.number2,
      number3: req.body.number3,
      whatsapp1: req.body.whatsapp1,
      whatsapp2: req.body.whatsapp2,
      whatsapp3: req.body.whatsapp3,
      email1: req.body.email1,
      email2: req.body.email2,
      email3: req.body.email3,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
      youtube: req.body.youtube,
    });
    contact.save().then((createdQuote) => {
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

router.put("/:id", (req, res, next) => {
  const bannerId = req.params.id;

  const updatedContact = {
    address1: req.body.address1,
    address2: req.body.address2,
    address3: req.body.address3,
    number1: req.body.number1,
    number2: req.body.number2,
    number3: req.body.number3,
    whatsapp1: req.body.whatsapp1,
    whatsapp2: req.body.whatsapp2,
    whatsapp3: req.body.whatsapp3,
    email1: req.body.email1,
    email2: req.body.email2,
    email3: req.body.email3,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    linkedin: req.body.linkedin,
    youtube: req.body.youtube,
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
  try {
    Contact.find().then((data) => {
      res.status(200).json({ contact: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
