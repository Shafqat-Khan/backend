const express = require("express");
const Blog = require('../models/blog');
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
    const blog = new Blog({
      heading: req.body.heading,
      description: req.body.description,
      imagePath: image, 
    });
    blog.save().then((createdBlog) => {
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

    const updatedBlog = {
      heading: req.body.heading,
      description: req.body.description,
      imagePath: image,
    };
    Blog.findByIdAndUpdate(bannerId, updatedBlog, { new: true })
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
router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedBlog = {
      heading: req.body.heading,
      description: req.body.description,
      imagePath: req.body.imagePath,
    };
    Blog.findByIdAndUpdate(bannerId, updatedBlog, { new: true })
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
  Blog.find().then((data) => {
    res.status(200).json({ blogs: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Blog.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
