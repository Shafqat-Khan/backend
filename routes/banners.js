const express = require("express");
const Banners = require("../models/banners");
const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the destination directory based on the file type
    const isValidImage = MIME_TYPE_MAP[file.mimetype];
    const isValidLogo = MIME_TYPE_MAP[file.mimetype];

    let error = new Error(
      `Invalid mime type ${file.mimetype}, only image and logo are allowed`
    );

    if (isValidImage && isValidLogo) {
      error = null;
      cb(null, "images"); 
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
    { name: "logo", maxCount: 1 },  
  ]),
  (req, res, next) => {
    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;
    const logo = imageUrl + "/images/" + req.files["logo"][0].filename;
    console.log(logo)
    const banners = new Banners({
      heading: req.body.heading,
      description: req.body.description,
      url: req.body.url,
      imagePath: image, 
      logoPath: logo,  
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
    { name: "logo", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.body,"GGGG")
    const bannerId = req.params.id;

    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;
    const logo = imageUrl + "/images/" + req.files["logo"][0].filename;

    const updatedBanner = {
      heading: req.body.heading,
      description: req.body.description,
      url: req.body.url,
      imagePath: image,
      logoPath: logo,
    };
    console.log(updatedBanner,"GG")
    Banners.findByIdAndUpdate(bannerId, updatedBanner, { new: true })
      .then((updatedBanner) => {
        if (!updatedBanner) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedBanner);
        res.status(200).json({ message: "Data updated successfully", banner: updatedBanner });
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
    { name: "logo", maxCount: 1 },
  ]),
  (req, res, next) => {
    const bannerId = req.params.id;


    const updatedBanner = {
      heading: req.body.heading,
      description: req.body.description,
      url: req.body.url,
      imagePath: req.body.imagePath,
      logoPath: req.body.logoPath,
    };
    Banners.findByIdAndUpdate(bannerId, updatedBanner, { new: true })
      .then((updatedBanner) => {
        if (!updatedBanner) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedBanner);
        res.status(200).json({ message: "Data updated successfully", banner: updatedBanner });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Banners.find().then((data) => {
    res.status(200).json({ banners: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Banners.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
