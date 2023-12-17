const router = require('express').Router();
const patients = require('./patients');
const admin = require('./admin');
const doctors = require('./doctors');

router.use('/', patients);
router.use('/admin', admin);
router.use('/doctor', doctors);


module.exports = router;