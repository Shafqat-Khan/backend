const express = require("express");
const Job = require('../models/job');
const router = express.Router();

router.post(
  "",
  
  (req, res, next) => {

    const banners = new Job({
      heading: req.body.heading,
      description: req.body.description,
    });
    console.log(banners)
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


router.put(
  "/:id",
  
  (req, res, next) => {
    const bannerId = req.params.id;

    const updatedJob = {
      heading: req.body.heading,
      description: req.body.description,
    };

    Job.findByIdAndUpdate(bannerId, updatedJob, { new: true })
      .then((updatedJob) => {
        if (!updatedJob) {
          return res.status(404).json({ error: "Banner not found" });
        }
        console.log(updatedJob);
        res.status(200).json({ message: "Data updated successfully", banner: updatedJob });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  }
);

router.get("", (req, res, next) => {
  Job.find().then((data) => {
    res.status(200).json({ jobs: data });
  });
});

router.delete("/:id", (req, res, next) => {
  Job.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Data deleted" });
  });
});

module.exports = router;
