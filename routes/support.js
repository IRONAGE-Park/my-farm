var express = require("express");
var router = express.Router();
var mysql = require("mysql");
const dbconfig = require("./dbconfig");



router.get("/", function (req, res, next) {
    let connection = mysql.createConnection(dbconfig);
    connection.connect();
    let query = 'select * from notice'
    connection.query(query, function (err, rows, ) {
        if (err) console.error(err);
        else {
            let pagingRows
            if (rows.length > 10) {
                pagingRows = rows.slice(0, 10);
                //한페이지에 10개씩 보여주고 싶을때 배열 구조
            }
            else {
                pagingRows = JSON.parse(JSON.stringify(rows));
            }

            console.log(pagingRows, rows);
            res.render("support/support_notice", { AllRows: rows, contents: pagingRows });
        }
    })
    connection.end();
});


router.get('/notice_content/:idx', function (req, res, next) {
    console.log(req);
    var idx = parseInt(req.params.idx);
    if (idx === 0) {
        res.send('<script type="text/javascript">alert("이전 페이지가 없습니다");</script>');
        // 페이지를 앞쪽으로 계속 넘겼을때 이전 페이지가 없을 경우
    }
    let connection = mysql.createConnection(dbconfig);
    connection.connect();

    let update_query = `UPDATE notice set viewcount=viewcount+1 WHERE idx=?`;
    // 조회수 업데이트 코드
    let select_query = `SELECT * FROM notice`;
    connection.query(update_query, idx, function (err, next) {
        if (err) {
            res.status(404).end();
            throw err;
        }
    })
    connection.query(select_query, function (err, rows, next) {
        if (err) {
            res.status(404).end();
            throw err;
        }
        else {
            if (idx > rows.length) {
                res.send('<script type="text/javascript">alert("다음 페이지가 없습니다");</script>');
                // 페이지를 뒤쪽으로 계속 넘겼을때 다음 페이지가 없을 경우
                connection.end();
            }
            else {
                res.render('support/notice_content', { contents: rows, idx: idx })
                connection.end();
            }
        }
    })
})

router.get('/page=:state', function (req, res, next) {
    var pageCount = parseInt(req.params.state);
    let connection = mysql.createConnection(dbconfig);
    connection.connect();

    var select_query = `SELECT * FROM notice`;

    connection.query(select_query, function (err, rows, next) {
        if (err) throw err;
        let pagingRows = rows.slice((pageCount - 1) * 10, pageCount * 10);
        res.render('support/support_notice', { AllRows: rows, contents: pagingRows, page: pageCount })
        connection.end();
    })
})



module.exports = router;