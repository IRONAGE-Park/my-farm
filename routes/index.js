var express = require("express");
var router = express.Router();
var mysql = require("mysql");
const dbconfig = require("./dbconfig");

// router.use("/:id", function (req, res, next) {
//   let connection = mysql.createConnection(dbconfig);
//   connection.connect();
//   let query = `UPDATE visit_count SET count = count + 1 WHERE page = '${req.params.id}'`;
//   connection.query(query, function (err, rows, fields) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(rows);
//     }
//   });
//   connection.end();
//   next();
// });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/branding", function (req, res, next) {
  res.render("branding");
});
router.get("/product", function (req, res, next) {
  res.render("product");
});
router.get("/animate", function (req, res, next) {
  res.render("animate");
});

module.exports = router;
