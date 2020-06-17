var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("");
});
router.get("/branding", function (req, res, next) {
  res.render("branding");
});
router.get("/product", function (req, res, next) {
  res.render("product");
});

module.exports = router;