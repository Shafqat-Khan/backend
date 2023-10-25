const express = require("express");
const Contant = require('../models/contant');
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
    const banners = new Contant({
      heading: req.body.heading,
      contant: req.body.contant,
      text1: req.body.text1,
      text2: req.body.text2,
      imagePath: image, 
    });
    banners.save().then((createdBanner) => {
      res.status(201).json({
        message: "Data received successfully",
        banner: {
          ...createdBanner,
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

    const updatedContant = {
        heading: req.body.heading,
        contant: req.body.contant,
        text1: req.body.text1,
        text2: req.body.text2,
        imagePath: image, 
    };

    Contant.findByIdAndUpdate(bannerId, updatedContant, { new: true })
      .then((updatedContant) => {
        if (!updatedContant) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedContant);
        res.status(200).json({ message: "Data updated successfully", banner: updatedContant });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);
router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedContant = {
        heading: req.body.heading,
        contant: req.body.contant,
        text1: req.body.text1,
        text2: req.body.text2,
        imagePath: req.body.imagePath, 
    };

    Contant.findByIdAndUpdate(bannerId, updatedContant, { new: true })
      .then((updatedContant) => {
        if (!updatedContant) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedContant);
        res.status(200).json({ message: "Data updated successfully", banner: updatedContant });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Contant.find().then((data) => {
    res.status(200).json({ contants: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Contant.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
