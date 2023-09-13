const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const bannersRoutes = require('./routes/banners');
const blogsRoutes = require('./routes/blogs');
const contantsRoutes = require('./routes/contants');
const quotesRoutes = require('./routes/quotes');
const teamsRoutes = require('./routes/teams');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const jobRoutes = require('./routes/job');
const clientRoutes = require('./routes/client');
const seoRoutes = require('./routes/seo');
const userRoutes = require('./routes/user');
const careerRoutes = require('./routes/career');
const subscriberRoutes = require('./routes/subscribers');
const app = express();

mongoose.connect("mongodb+srv://gaztron:PL7QKJxlbncRc80e@cluster0.jdqnsl0.mongodb.net/gaztron?retryWrites=true&w=majority")
.then(()=>{
  console.log(`Connected to MongoDB`);
})
.catch(() =>{
  console.error("Connection Failed!");
});
app.use("/images", express.static(path.join(__dirname ,"images")));
app.use("/files", express.static(path.join(__dirname ,"files")));
app.use("/", express.static(path.join(__dirname ,"gaztron")));




app.use(express.json());
// app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization", 
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});


app.use("/api/banners", bannersRoutes);
app.use("/api/blogs/", blogsRoutes);
app.use("/api/quotes/", quotesRoutes);
app.use("/api/contants/", contantsRoutes);
app.use("/api/teams/", teamsRoutes);
app.use("/api/about/", aboutRoutes);
app.use("/api/contact/", contactRoutes);
app.use("/api/jobs/", jobRoutes);
app.use("/api/clients/", clientRoutes);
app.use("/api/seo/", seoRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/career/", careerRoutes);
app.use("/api/subscribers/", subscriberRoutes);
app.use((req, res, next)=>{
  res.sendFile(path.join(__dirname,"gaztron", "index.html"));
});

module.exports = app;
