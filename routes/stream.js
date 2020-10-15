var express = require('express');
var router = express.Router();
var passport = require('passport');
const getToken = require('./getToken');
const goStream = require('./goStream');
require('../dbconfig/passport')(passport);
const signal = require('../server')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const token = getToken(req.headers);
    if (token) {
        const signalling = signal.io;
        goStream(signalling);
    } else {
        console.log('Unauthorized');
        return res.status(403).send({ message: 'Unauthorized' })
    }
});

module.exports = router;