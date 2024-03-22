const express = require("express");
const Career = require("../models/career");

const multer = require("multer");
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
const MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValidFile = MIME_TYPE_MAP[file.mimetype];

    let error = new Error(
      `Invalid mime type ${file.mimetype}, only PDF files are allowed`
    );

    if (isValidFile) {
      error = null;
      cb(null, "files");
    } else {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
router.post(
  "",

  multer({ storage: storage }).fields([{ name: "pdf", maxCount: 1 }]),
  (req, res, next) => {
    try {
      const pdfUrl = req.protocol + "://" + req.get("host");
      const pdfPath = pdfUrl + "/files/" + req.files["pdf"][0].filename;
      const career = new Career({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        position: req.body.position,
        pdfPath: pdfPath,
      });
      career.save().then(async (createdCareer) => {
        const emailInfo = await transporter.sendMail({
          from: "gaztronindiaa@gmail.com",
          to: `${req.body.email}`,
          subject: "Thank You for Applying",
          text: `Dear ${req.body.name},
  
Thank you for applying for ${req.body.position} at Gaztron! We have received your application and will review it carefully.
  
If your qualifications match our requirements, we will be in touch for the next steps in the hiring process.
  
We appreciate your interest in joining our team.
  
Best regards,
Gaztron`,
        });

        console.log("Email sent: %s", emailInfo.messageId);

        const emailInfo1 = await transporter.sendMail({
          from: "gaztronindiaa@gmail.com",
          to: `marketing@gaztronengineering.com`,
          subject: "New Job Application",
          text: `You have received a new job application from ${req.body.name} (${req.body.email}). 
Please review and respond accordingly.
  
Application Details:
Name: ${req.body.name}
Email: ${req.body.email}
Phone: ${req.body.phone}
Position applied for: ${req.body.position}
Message: ${req.body.message}`,
        });

        console.log("Email sent: %s", emailInfo1.messageId);
        res.status(201).json({
          message: "Data received successfully",
          career: {
            ...createdCareer,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("", (req, res, next) => {
  try {
    Career.find().then((data) => {
      res.status(200).json({ career: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Career.deleteOne({ _id: req.params.id }).then((result) => {
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
