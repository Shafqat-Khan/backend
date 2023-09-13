const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user.save().then((createdUser) => {
      res.status(201).json({
        message: "User Saved",
        user: {
          ...createdUser,
        },
      });
    });
  });
});
router.post("/login", (req, res, next) => {
  let fetchUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed!",
        });
      }
      fetchUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed!",
        });
      }
      const token = jwt.sign(
        { email: fetchUser.email, userId: fetchUser._id },
        "secret_gaztron_website_password",
        { expiresIn: '1h', }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth Failed!",
      });
    });
});

router.put("/:id", (req, res, next) => {
  const bannerId = req.params.id;

  const updatedUser = {
    heading: req.body.heading,
    description: req.body.description,
    keyword: req.body.keyword,
  };

  User.findByIdAndUpdate(bannerId, updatedUser, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "Banner not found" });
      }
      console.log(updatedUser);
      res
        .status(200)
        .json({ message: "Data updated successfully", banner: updatedUser });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("", (req, res, next) => {
  User.find().then((data) => {
    res.status(200).json({ users: data });
  });
});



module.exports = router;
