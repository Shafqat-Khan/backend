const express = require("express");
const Quote = require("../models/quote");
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

router.post("", limiter, (req, res, next) => {
  try {
    const quotes = new Quote({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      selection: req.body.selection,
    });
    quotes.save().then(async (createdQuote) => {
      const emailInfo = await transporter.sendMail({
        from: "gaztronindiaa@gmail.com",
        to: `${req.body.email}`,
        subject: "Quote Request Received",
        text: `Dear ${req.body.name},
  
Thank you for reaching out to us for a quote! We appreciate your interest in our services.
  
Our team is currently reviewing your request, and we will get back to you with a personalized quote as soon as possible.
  
If you have any additional details or specific requirements, feel free to reply to this email or contact our customer support.
  
We look forward to the opportunity to work with you.
  
Best regards,
Gaztron`,
      });
  
      console.log("Email sent: %s", emailInfo.messageId);
  
      const emailInfo1 = await transporter.sendMail({
        from: "gaztronindiaa@gmail.com",
        to: `marketing@gaztronengineering.com`,
        subject: "New Quote Request",
        text: `You have received a new quote request from ${req.body.name} (${req.body.email}). 
        
Please review and respond accordingly.`,
      });
  
      console.log("Email sent: %s", emailInfo1.messageId);
  
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

router.get("", (req, res, next) => {
  try {
    Quote.find().then((data) => {
      res.status(200).json({ quotes: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Quote.deleteOne({ _id: req.params.id }).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
