const express = require("express");
const Client = require("../models/client");
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

  multer({ storage: storage }).fields([{ name: "image", maxCount: 1 }]),
  (req, res, next) => {
    try {
      const imageUrl = req.protocol + "://" + req.get("host");
      const image = imageUrl + "/images/" + req.files["image"][0].filename;
      const client = new Client({
      	heading: req.body.heading,
        imagePath: image,
      });
      client.save().then((createdClient) => {
        res.status(201).json({
          message: "Data received successfully",
          banner: {
            ...createdClient,
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

  multer({ storage: storage }).fields([{ name: "image", maxCount: 1 }]),
  (req, res, next) => {
    const bannerId = req.params.id;

    const imageUrl = req.protocol + "://" + req.get("host");
    const image = imageUrl + "/images/" + req.files["image"][0].filename;

    const updatedClient = {
      heading: req.body.heading,
      imagePath: image,
    };
    Client.findByIdAndUpdate(bannerId, updatedClient, { new: true })
      .then((updatedClient) => {
        if (!updatedClient) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedClient);
        res.status(200).json({
          message: "Data updated successfully",
          banner: updatedClient,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  try {
    Client.find().then((data) => {
      res.status(200).json({ clients: data });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    Client.deleteOne({ _id: req.params.id }).then((result) => {
      console.log(result);
      res.status(200).json({ message: "Data deleted" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
