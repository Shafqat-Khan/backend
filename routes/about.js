const express = require("express");
const About = require('../models/about');
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValidImage = MIME_TYPE_MAP[file.mimetype];

    let error = new Error(
      `Invalid mime type ${file.mimetype}, only image and logo are allowed`
    );

    if (isValidImage) {
      error = null;
      cb(null, "backend/images"); 
    } 
     else {
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
    { name: "image", maxCount: 1 }, 
  ]),
  (req, res, next) => {
    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;
    const about = new About({
      heading: req.body.heading,
      description: req.body.description,
      imagePath: image, 
    });
    about.save().then((createdBlog) => {
      res.status(201).json({
        message: "Data received successfully",
        banner: {
          ...createdBlog,
        },
      });
    });
  }
);
router.post(
  "/:id",
  
  multer({ storage: storage }).fields([
    { name: "image", maxCount: 1 },

  ]),
  (req, res, next) => {
    const bannerId = req.params.id;

    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;

    const updatedAbout = {
      heading: req.body.heading,
      description: req.body.description,
      imagePath: image,
    };
    About.findByIdAndUpdate(bannerId, updatedAbout, { new: true })
      .then((updatedAbout) => {
        if (!updatedAbout) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedAbout);
        res.status(200).json({ message: "Data updated successfully", banner: updatedAbout });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);
router.put(
  "/:id",
  
  multer({ storage: storage }).fields([
    { name: "image", maxCount: 1 },

  ]),
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedAbout = {
      heading: req.body.heading,
      description: req.body.description,
      imagePath: req.body.imagePath,
    };
    About.findByIdAndUpdate(bannerId, updatedAbout, { new: true })
      .then((updatedAbout) => {
        if (!updatedAbout) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedAbout);
        res.status(200).json({ message: "Data updated successfully", banner: updatedAbout });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  About.find().then((data) => {
    res.status(200).json({ about: data });
  });
});


module.exports = router;
