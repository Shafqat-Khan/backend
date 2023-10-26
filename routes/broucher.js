const express = require("express");
const Broucher = require("../models/broucher");

const multer = require("multer");
const router = express.Router();

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
      cb(null, "backend/files"); 
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
    const broucher = new Broucher({
      pdfPath: pdfPath, 
    });
    broucher.save().then((createdBroucher) => {
      res.status(201).json({
        message: "Data received successfully",
        Broucher: {
          ...createdBroucher,
        },
      });
    });
  }
);
router.post(
    "/:id",
    
    multer({ storage: storage }).fields([
      { name: "pdf", maxCount: 1 },
  
    ]),
    (req, res, next) => {
      const bannerId = req.params.id;
  
      const pdfUrl = req.protocol + "://" + req.get("host");
      const pdfPath = pdfUrl + "/files/" + req.files["pdf"][0].filename; 
  
      const updatedBlog = {
        pdfPath: pdfPath, 
      };
      Broucher.findByIdAndUpdate(bannerId, updatedBlog, { new: true })
        .then((updatedBlog) => {
          if (!updatedBlog) {
            return res.status(404).json({ error: "Banner not found" });
          }
          res.status(200).json({ message: "Data updated successfully", banner: updatedBlog });
        })
        .catch((error) => {
          res.status(500).json({ error: "Internal server error" });
        });
    }
  );
router.get("", (req, res, next) => {
  Broucher.find().then((data) => {
    res.status(200).json({ broucher: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Broucher.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
