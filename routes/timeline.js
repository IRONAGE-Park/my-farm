const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    // 예약 페이지 렌더
    res.render('timeline');
});

module.exports = router;