const express = require("express");
const Subscriber = require("../models/subscriber");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const router = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gaztronindiaa@gmail.com",
    pass: "clmc kati qgqy pyja",
  },
});
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});

router.post("", limiter, async (req, res, next) => {
  try {
    const newSubscriber = new Subscriber({
      email: req.body.email,
    });

    const createdSubscriber = await newSubscriber.save();

    const emailInfo = await transporter.sendMail({
      from: "gaztronindiaa@gmail.com",
      to: `${req.body.email}`,
      subject: "Welcome to Our Blog Community",
      text: `Dear ${req.body.email},

Thank you for subscribing to our blog! We're delighted to have you as part of our community.

Get ready for insightful articles, engaging stories, and the latest updates directly delivered to your inbox.

Happy reading!

Best regards,
The Gaztron Blog Team`,
    });

    console.log("Email sent: %s", emailInfo.messageId);

    res.status(201).json({
      message: "Data received successfully",
      banner: { ...createdSubscriber },
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("", (req, res, next) => {
  try {
    Subscriber.find().then((data) => {
      res.status(200).json({ subscribers: data });
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Subscriber.deleteOne({ _id: req.params.id }).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    console.error("Error processing subscription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
