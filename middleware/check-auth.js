const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("reached")
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_gaztron_website_password");
  } catch (error) {
    res.status(401).json({
      message: "Auth Failed!",
    });
  }
};
