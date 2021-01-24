const express = require('express');
const router = express.Router();
const { convertDeltaToHtml } = require('node-quill-converter');


router.get('/', function (req, res, next) {
    // 다이어리 페이지 렌더.
    res.render('diary');
});

/* REST API */
router.get('/api', function (req, res, next) {
    // 모든 다이어리 내용 가져오기.
    /*
        Parameter: X
    */
    res.status(200).send(null);
});
router.get('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 가져오기.
    /* 
        Parameter:
            date = 가져올 날짜.
    */
    res.status(200).send(null);
});
router.post('/api', function (req, res, next) {
    // 다이어리 날짜의 내용 삽입.
    /*
        Parameter:
            diary_date = 삽입할 날짜
            diary_title = 삽입할 제목
            diary_content = 삽입할 내용

    */
    res.status(200).send(null);
});
router.put('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 수정.
    /*
        Parameter:
            date = 수정할 날짜
            diary_title = 수정할 제목
            diary_content = 수정할 내용
    */
    res.status(200).send(null);
});
router.delete('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 삭제
    /*
        Parameter:
            date = 삭제할 날짜
    */
    res.status(200).send(null);
});

module.exports = router;