const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbconfig = require('./dbconfig');
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
    const connection = mysql.createConnection(dbconfig);
    connection.connect();

    const query = `SELECT * FROM diary`;
    connection.query(query, function (err, result) {
        if (err) {
            res.status(404).end();
            throw err;
        } else {
            res.json(result);
        }
    });
    connection.end();
});
router.get('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 가져오기.
    /* 
        Parameter:
            date = 가져올 날짜.
    */
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    const date = req.params.date;

    const query = `SELECT title, content FROM diary WHERE date=?`;
    connection.query(query, [date], function (err, result) {
        if (err) {
            res.status(404).end();
            throw err;
        } else {
            res.json(result[0]);
        }
    })
    connection.end();
});
router.post('/api', function (req, res, next) {
    // 다이어리 날짜의 내용 삽입.
    /*
        Parameter:
            diary_date = 삽입할 날짜
            diary_title = 삽입할 제목
            diary_content = 삽입할 내용

    */
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    console.log(req);
    const date = req.body.diary_date;
    const title = req.body.diary_title;
    const delta = req.body.diary_content;
    const content = convertDeltaToHtml(JSON.parse(delta));
    console.log(content)

    const query = `INSERT INTO diary(date, title, content, createdate) VALUES(?, ?, ?, NOW())`;
    connection.query(query, [date, title, content], function (err, result) {
        if (err) {
            res.status(404).end();
            throw err;
        } else {
            res.json(result[0])
        }
    });
    connection.end();
});
router.put('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 수정.
    /*
        Parameter:
            date = 수정할 날짜
            diary_title = 수정할 제목
            diary_content = 수정할 내용
    */
    const date = req.query.date;
    const title = req.body.diary_title;
    const delta = req.body.diary_content;
    const content = convertDeltaToHtml(JSON.parse(delta));

    const query = `UPDATE diary SET title=?, content=? WHERE date=?`;

    connection.query(query, [title, content, date], function (err, result) {
        if (err) {
            res.status(404).end();
        } else {
            res.json(result[0]);
        }
    });
    connection.end();
});
router.delete('/api/:date', function (req, res, next) {
    // 다이어리 날짜의 내용 삭제
    /*
        Parameter:
            date = 삭제할 날짜
    */
    const query = `DELETE FROM diary WHERE date=?`;
    connection.query(query, [req.body.date], function (err, result) {
        if (err) {
            res.status(404).end();
            throw err;
        } else {
            res.json("success");
        }
    });
});

module.exports = router;