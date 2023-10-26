const express = require("express");
const Team = require('../models/team');
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
    const banners = new Team({
        name: req.body.name,
        designation: req.body.designation,
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
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

    const updatedTeam = {
      name: req.body.name,
      designation: req.body.designation,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
      imagePath: image,
    };
    
    Team.findByIdAndUpdate(bannerId, updatedTeam, { new: true })
      .then((updatedTeam) => {
        if (!updatedTeam) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedTeam);
        res.status(200).json({ message: "Data updated successfully", banner: updatedTeam });
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


    const updatedTeam = {
      name: req.body.name,
      designation: req.body.designation,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
      imagePath: req.body.imagePath,
    };
    
    Team.findByIdAndUpdate(bannerId, updatedTeam, { new: true })
      .then((updatedTeam) => {
        if (!updatedTeam) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedTeam);
        res.status(200).json({ message: "Data updated successfully", banner: updatedTeam });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Team.find().then((data) => {
    res.status(200).json({ teams: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Team.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
