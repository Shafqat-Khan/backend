const express = require("express");
const Projects = require("../models/projects");
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
      cb(null, "images");
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
  multer({ storage: storage }).array("images", 10),
  (req, res, next) => {
    try {
      const imageUrl = req.protocol + "://" + req.get("host");

      const images = req.files.map(
        (file) => imageUrl + "/images/" + file.filename
      );
      const youtubeUrls = req.body.youtubeUrls;

      const product = new Projects({
        heading: req.body.heading,
        category: req.body.category,
        productUrl: req.body.productUrl,
        description: req.body.description,
        productTitle: req.body.productTitle,
        pageTitle: req.body.pageTitle,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        keyword: req.body.keyword,
        imagePath: images,
        youtubeUrls: youtubeUrls,
      });

      product.save().then((createdProduct) => {
        res.status(201).json({
          message: "Data received successfully",
          banner: {
            ...createdProduct,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/:id",
  multer({ storage: storage }).fields([{ name: "images", maxCount: 10 }]),
  async (req, res, next) => {
    const bannerId = req.params.id;

    try {
      let images = req.body.images || [];

      if (req.files && req.files["images"]) {
        // Add new images
        const newImages = req.files["images"].map((file) => {
          const imageUrl = req.protocol + "://" + req.get("host");
          return imageUrl + "/images/" + file.filename;
        });
        images = images.concat(newImages);
      }

      const youtubeUrls = req.body.youtubeUrls || [];

      const updatedProduct = {
        heading: req.body.heading,
        category: req.body.category,
        productUrl: req.body.productUrl,
        description: req.body.description,
        productTitle: req.body.productTitle,
        pageTitle: req.body.pageTitle,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        keyword: req.body.keyword,
        imagePath: images,
        youtubeUrls: youtubeUrls,
      };

      const updatedResult = await Projects.findByIdAndUpdate(
        bannerId,
        updatedProduct,
        { new: true }
      );

      if (!updatedResult) {
        return res.status(404).json({ error: "Banner not found" });
      }

      res.status(200).json({
        message: "Data updated successfully",
        banner: updatedResult,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/:id",

  (req, res, next) => {
    try {
      const bannerId = req.params.id;

      const updatedProduct = {
        heading: req.body.heading,
        category: req.body.category,
        productUrl: req.body.productUrl,
        description: req.body.description,
        imagePath: req.body.imagePath,
        youtubeUrls: req.body.youtubeUrls,
        productTitle: req.body.productTitle,
        pageTitle: req.body.pageTitle,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        keyword: req.body.keyword,
      };
      Projects.findByIdAndUpdate(bannerId, updatedProduct, { new: true })
        .then((updatedProduct) => {
          if (!updatedProduct) {
            return res.status(404).json({ error: "Banner not found" });
          }
          res.status(200).json({
            message: "Data updated successfully",
            banner: updatedProduct,
          });
        })
        .catch((error) => {
          res.status(500).json({ error: "Internal server error" });
        });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("", (req, res, next) => {
  try {
    Projects.find().then((data) => {
      res.status(200).json({ blogs: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Projects.deleteOne({ _id: req.params.id }).then((result) => {
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
