var express = require('express');
var router = express.Router();
var passport = require('passport');
const getToken = require('./getToken');
require('../dbconfig/passport')(passport);

//Verifikasi Untuk Mendapatkan Data pada React
router.get("/verify/token", (req, res) => {
    const token = getToken(req.headers);
    if (!token) {
        return res.status(400).json({ message: 'token belum di-post' })
    }
    //get user
    jwt.verify(token, secretOrKey, (err, user) => {
        if (err) {
            throw err;
        }
        User.findById({
            '_id': user.id
        }, (err, user) => {
            if (err) {
                throw err;
            }
            res.json({
                user: user,
                token: token
            })
        })
    })
})

// router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     const token = getToken(req.headers);
//     if (token) {
//         Gallery.getImages((err, images) => {
//             if (err) {
//                 throw err
//             }
//             res.json(images)
//         })
//     } else {
//         console.log('Unauthorized');
//         return res.status(403).send({ message: 'Unauthorized' })
//     }
// });

module.exports = router;
