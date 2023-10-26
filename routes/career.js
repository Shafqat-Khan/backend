const express = require("express");
const Career = require("../models/career");

const multer = require("multer");
const rateLimit = require("express-rate-limit");
const router = express.Router();

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
  
  multer({ storage: storage }).fields([
    { name: "pdf", maxCount: 1 }, 
  ]),
  (req, res, next) => {
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
    career.save().then((createdCareer) => {
      res.status(201).json({
        message: "Data received successfully",
        career: {
          ...createdCareer,
        },
      });
    });
  }
);

router.get("", (req, res, next) => {
  Career.find().then((data) => {
    res.status(200).json({ career: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Career.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
