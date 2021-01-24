const express = require("express");
const router = express.Router();
const { convertDeltaToHtml } = require('node-quill-converter');


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
        res.send('<script>alert("아이디 또는 패스워드를 확인해주세요");history.go(-1);</script>')
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
        res.render('admin/notice', { contents: result });
    }
});

module.exports = router;