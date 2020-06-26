const express = require("express");
const mysql = require("mysql");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');
const dbconfig = require("./dbconfig");
const { convertDeltaToHtml } = require('node-quill-converter');
const { base64encode, base64decode } = require('nodejs-base64');
const router = express.Router();

const dboption = dbconfig;
const connection = mysql.createConnection(dbconfig);
connection.connect();

router.use(session({
    secret: 'bangbongbim',
    store: new MySQLStore(dboption),
    resave: false,
    saveUninitialized: true
}));

//db내에 idx 재정렬
function sort() {
    const query1 = `ALTER TABLE notice AUTO_INCREMENT=1;`;
    const query2 = `SET @COUNT = 0;`;
    const query3 = `UPDATE notice SET idx=@count:=@count+1;`;
    connection.query(query1, function (err) {if (err) throw err;})
    connection.query(query2, function (err) {if (err) throw err;})
    connection.query(query3, function (err) {if (err) throw err;})
}
router.get('/', function (req, res) {
    if (req.session.name) {
        res.render('admin/main');
    } else {
        res.render('admin/index');
    }
});
router.post('/login', function (req, res) {
    const id = req.body.adminID;
    const pw = req.body.adminPW;
    if (id === '' || pw === '') {
        res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
    }
    else {
        const query = `SELECT * FROM admin WHERE id=?`;
        connection.query(query, [id], function (err, result) {
            if (result[0] === undefined)
                res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
            else {
                const admin = result[0];
                crypto.pbkdf2(pw, admin.salt, 100000, 64, 'sha512', (err1, key) => {
                    if ((admin.password).toString('base64') === key.toString('base64')) {
                        req.session.name = admin.id;
                        req.session.save(function () {
                            res.redirect('/admin/main');
                        });
                    }
                    else {
                        res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
                    }
                });
            }
        });
    }
});
router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/admin');
    });
});
router.get('/main', function (req, res) {
    if (!req.session.name) {
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    }
    else {
        res.render('admin/main');
    }
});
router.get('/diary', function (req, res) {
    if (!req.session.name) {
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    }
    else {
        res.render('admin/diary');
    }
})

router.get('/notice', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else {
        const query = `SELECT * FROM notice`;
        connection.query(query, function (err, result) {
            if (err) throw err;
            res.render('admin/notice', { contents: result });
        });
    }
});
router.get('/write-notice', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else
        res.render('admin/write-notice');
});
router.get('/view-notice/:idx', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else {
        let idx = parseInt(req.params.idx);
        // db에는 index가 1부터 시작이어서 +1 해줌
        const query = `SELECT * FROM notice WHERE idx=?`;
        connection.query(query, [idx], function (err, result) {
            if (err) throw err;
            res.render('admin/view-notice', { notice_content: result });
        });
    }
});
router.post('/notice-insert', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else {
        const title = req.body.notice_title;
        const delta = req.body.notice_contents;
        const contents = convertDeltaToHtml(JSON.parse(delta));
        const query = `INSERT INTO notice(title,content,createdate) VALUES(?,?,NOW())`;
        connection.query(query, [title, contents], function (err) {
            if (err) throw err;
            sort();
            res.redirect('notice');
        });

    }
});
router.post('/notice-update', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else {
        const idx = req.body.notice_idx;
        let title = req.body.notice_title;
        let delta = req.body.notice_contents;
        let contents = convertDeltaToHtml(JSON.parse(delta));

        const query = `UPDATE notice SET title=?,content=? WHERE idx=?`;
        connection.query(query, [title, contents, idx], function (err) {
            if (err) throw err;
            res.redirect('notice');
        });

    }
});
router.post('/notice-delete', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>');
    else {
        sort();
        let data = req.body;
        let CheckedArray = Object.keys(data);
        for (let i = 0; i < CheckedArray.length; i++) {
            CheckedArray[i] = parseInt(CheckedArray[i]);
        }
        const query = `DELETE FROM notice WHERE idx=?`;
        for (let i = 0; i < CheckedArray.length; i++) {
            connection.query(query, CheckedArray[i], function (err) {
                // idx 번호는 1부터 시작함.
                if (err) throw err;
            })
        }
        sort();
        res.redirect('notice');
    }
});

module.exports = router;