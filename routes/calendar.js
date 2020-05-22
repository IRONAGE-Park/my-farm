var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const dbconfig = require('./dbconfig');

router.get('/', function (req, res, next) {
    // 예약 페이지 렌
    res.render('calendar/index');
});

module.exports = router;