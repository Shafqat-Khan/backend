const express = require("express");
const Quote = require("../models/quote");
const rateLimit = require("express-rate-limit"); 
const router = express.Router();


const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5, 
  message: 'Too many requests from this IP, please try again later.',
});


router.post("",limiter, (req, res, next) => {
  const quotes = new Quote({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    selection: req.body.selection
  });
  quotes.save().then((createdQuote) => {
    res.status(201).json({
      message: "Data received successfully",
      banner: {
        ...createdQuote,
      },
    });
  });
});



router.get("", (req, res, next) => {
  Quote.find().then((data) => {
    res.status(200).json({ quotes: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Quote.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
