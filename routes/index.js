var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("");
});
router.get("/branding", function (req, res, next) {
  const viewPage = req.query.view ? req.query.view : 'intro'
  res.render("branding/" + viewPage);
});
router.get("/product", function (req, res, next) {
  res.render("product");
});

module.exports = router;