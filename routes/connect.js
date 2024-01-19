const express = require("express");
const Connect = require("../models/connect");
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
    const connect = new Connect({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });
    connect.save().then(async (createdConnect) => {
      const emailInfo = await transporter.sendMail({
        from: "gaztronindiaa@gmail.com",
        to: `${req.body.email}`,
        subject: "Thank You for Contacting Us",
        text: `Dear ${req.body.name},
  
Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
  
In the meantime, if you have any urgent questions or concerns, feel free to contact us directly at +91-8447203393.
  
We appreciate your interest in our services.
  
Best regards,
Gaztron`,
      });
  
      console.log("Email sent: %s", emailInfo.messageId);
  
      const emailInfo1 = await transporter.sendMail({
        from: "gaztronindiaa@gmail.com",
        to: `info@gaztron.in`,
        subject: "New Quick Contact Form Submission",
        text: `You have received a new contact form submission from ${req.body.name} (${req.body.email}). 
Please review and respond accordingly.
  
Contact Details:
Name: ${req.body.name}
Email: ${req.body.email}
Phone: ${req.body.phone}
Questions/Comments:
${req.body.message}`,
      });
  
      console.log("Email sent: %s", emailInfo1.messageId);
      res.status(201).json({
        message: "Data received successfully",
        banner: {
          ...createdConnect,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("", (req, res, next) => {
  try {
    Connect.find().then((data) => {
      res.status(200).json({ data: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Connect.deleteOne({ _id: req.params.id }).then((result) => {
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
