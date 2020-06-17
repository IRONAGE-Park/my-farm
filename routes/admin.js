var express = require("express");
var mysql = require("mysql");
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var crypto = require('crypto');
const dbconfig = require("./dbconfig");
var fs = require('fs');
const { convertDeltaToHtml } = require('node-quill-converter');
const { base64encode, base64decode } = require('nodejs-base64');
var router = express.Router();

var dboption = dbconfig;
// var connection = mysql.createConnection(dbconfig);
// connection.connect();


router.use(session({
    secret: 'bangbongbim',
    store: new MySQLStore(dboption),
    resave: false,
    saveUninitialized: true
}))

//db내에 idx 재정렬
function sort() {
    const query1 = `ALTER TABLE notice AUTO_INCREMENT=1;`;
    const query2 = `SET @COUNT = 0;`;
    const query3 = `UPDATE notice SET idx=@count:=@count+1;`;
    connection.query(query1, function (err) {
        if (err) throw err;
        console.log('sort1 complete');
    })
    connection.query(query2, function (err) {
        if (err) throw err;
        console.log('sort2 complete');
    })
    connection.query(query3, function (err) {
        if (err) throw err;
        console.log('sort3 complete');
    })
}
router.get('/', function (req, res) {
    res.render('admin/index');
})


router.post('/login', function (req, res) {
    var id = req.body.adminID;
    var pw = req.body.adminPW;
    console.log(id, pw);
    if (id === '' || pw === '') {
        res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
    }
    else {
        var query = `SELECT * FROM admin WHERE id=?`;
        connection.query(query, [id], function (err, result) {
            if (result[0] === undefined)
                res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
            else {
                var admin = result[0];
                console.log(admin.id, admin.password);

                crypto.pbkdf2(pw, admin.salt, 100000, 64, 'sha512', (err1, key) => {
                    if ((admin.password).toString('base64') === key.toString('base64')) {
                        req.session.name = admin.id;
                        req.session.save(function () {
                            res.render('admin/main');
                        })

                    }
                    else {
                        res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
                        return
                    }
                })
            }
        })
    }



    // crypto.randomBytes(64, (err, buf) => {
    //     if (err) throw err;
    //     let salt = buf.toString('base64'); //salt 생성
    //     console.log('salt :', salt);
    //     connection.query(`UPDATE admin SET salt=? WHERE id=?`, [salt, 'admin'], function (err) {
    //         if (err) throw err;
    //         console.log('hash update');
    //     })
    //     // db에 저장된 패스워드와 생성한 salt를 합쳐서 해싱
    //     crypto.pbkdf2(admin.password, salt, 100000, 64, 'sha512', (err1, key) => {
    //         console.log(key.toString('base64'));
    //         connection.query(`UPDATE admin SET password=? WHERE id=?`, [key.toString('base64'), 'admin'], function (err) {
    //             if (err) throw err;
    //             console.log('hash complete');
    //         })
    //     })
    // })
})



router.get('/main', function (req, res) {
    if (!req.session.name) {
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    }
    else {
        console.log(req.session);
        res.render('admin/main')
    }

})

router.get('/notice', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    else {
        const query = `SELECT * FROM notice`;
        connection.query(query, function (err, result) {
            if (err) throw err;
            res.render('admin/notice', { contents: result });
        })
    }


})

router.get('/write-notice', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    else
        res.render('admin/write-notice');
})


router.get('/view-notice/:idx', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    else {
        let idx = parseInt(req.params.idx);
        // db에는 index가 1부터 시작이어서 +1 해줌
        const query = `SELECT * FROM notice WHERE idx=?`;
        console.log(typeof idx);
        connection.query(query, [idx], function (err, result) {
            if (err) throw err;
            // console.log(result);
            res.render('admin/view-notice', { notice_content: result });
        })

    }


})

router.post('/notice-insert', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    else {
        let title = req.body.notice_title;
        let delta = req.body.notice_contents;
        let contents = convertDeltaToHtml(JSON.parse(delta));


        const query = `INSERT INTO notice(title,content,createdate) VALUES(?,?,NOW())`;
        connection.query(query, [title, contents], function (err) {
            if (err) throw err;
            console.log('INSERTED SUCCESS');
            sort();
            res.redirect('notice');
        })

    }
})
router.post('/notice-update', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
    else {
        let title = req.body.notice_title;
        let delta = req.body.notice_contents;
        let contents = convertDeltaToHtml(JSON.parse(delta));


        const query = `UPDATE notice SET title=?,content=? `;
        connection.query(query, [title, contents], function (err) {
            if (err) throw err;
            console.log(' SUCCESS');
            res.redirect('notice');
        })

    }


})

router.post('/notice-delete', function (req, res) {
    if (!req.session.name)
        res.send('<script>alert("로그인을 해주세요");history.go(-1);</script>')
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
                console.log('DELETE SUCCESS');

            })
        }
        sort();
        res.redirect('notice');
    }

})

router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.render('admin/index');
    })
})
module.exports = router;