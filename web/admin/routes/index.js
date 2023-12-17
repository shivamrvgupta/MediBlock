const router = require('express').Router();
const authRoutes = require('./auth.routes');
const doctorRoutes = require('./doctor.routes')
const patientRoutes = require('./patients.routes')

router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/patients', patientRoutes);

module.exports = router;
