const express = require("express");
const Connect = require("../models/connect");
const rateLimit = require("express-rate-limit"); 
const router = express.Router();


const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5, 
  message: 'Too many requests from this IP, please try again later.',
});


router.post("",limiter, (req, res, next) => {
  const connect = new Connect({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  });
  connect.save().then((createdConnect) => {
    res.status(201).json({
      message: "Data received successfully",
      banner: {
        ...createdConnect,
      },
    });
  });
});



router.get("", (req, res, next) => {
  Connect.find().then((data) => {
    res.status(200).json({ data: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Connect.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
