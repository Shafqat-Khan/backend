const express = require("express");
const Subscriber = require("../models/subscriber");
const rateLimit = require("express-rate-limit"); 
const router = express.Router();


const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 5, 
  message: 'Too many requests from this IP, please try again later.',
});



router.post("",limiter, (req, res, next) => {
  const Subscribers = new Subscriber({
    email: req.body.email,

  });
  Subscribers.save().then((createdSubscriber) => {
    res.status(201).json({
      message: "Data received successfully",
      banner: {
        ...createdSubscriber,
      },
    });
  });
});



router.get("", (req, res, next) => {
  Subscriber.find().then((data) => {
    res.status(200).json({ subscribers: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Subscriber.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
