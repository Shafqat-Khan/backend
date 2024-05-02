const express = require("express");
const Images3d = require('../models/3d-images');
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
    console.log(req.body)
    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;
    const product = new Images3d({
      heading: req.body.heading,
      product: req.body.product,
      imagePath: image, 
    });
    product.save().then((createdProduct) => {
      res.status(201).json({
        message: "Data received successfully",
        banner: {
          ...createdProduct,
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

    const updatedProduct = {
      heading: req.body.heading,
      product: req.body.product,
      imagePath: image,
    };
    Images3d.findByIdAndUpdate(bannerId, updatedProduct, { new: true })
      .then((updatedProduct) => {
        if (!updatedProduct) {
          return res.status(404).json({ error: "Banner not found" });
        }
        res.status(200).json({ message: "Data updated successfully", banner: updatedProduct });
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error.." });
      });
  }
);
router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedProduct = {
      heading: req.body.heading,
      product: req.body.product,
      imagePath: req.body.imagePath,
    };
    Images3d.findByIdAndUpdate(bannerId, updatedProduct, { new: true })
      .then((updatedProduct) => {
        if (!updatedProduct) {
          return res.status(404).json({ error: "Banner not found" });
        }
        res.status(200).json({ message: "Data updated successfully", banner: updatedProduct });
      })
      .catch((error) => {
        res.status(500).json({ error: "Internal server error.." });
      });
  }
);

router.get("", (req, res, next) => {
  Images3d.find().then((data) => {
    res.status(200).json({ blogs: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Images3d.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;

