const express = require("express");
const Copyright = require('../models/copyright');
const router = express.Router();


router.post("", (req, res, next) => {
  
  const seos = new Copyright({
    text: req.body.text,
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

    const updatedCopyright = {
      text: req.body.text,
    };

    Copyright.findByIdAndUpdate(bannerId, updatedCopyright, { new: true })
      .then((updatedCopyright) => {
        if (!updatedCopyright) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedCopyright);
        res.status(200).json({ message: "Data updated successfully", banner: updatedCopyright });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Copyright.find().then((data) => {
    res.status(200).json({ data: data });
  });
});



module.exports = router;
