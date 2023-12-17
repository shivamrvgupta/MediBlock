const router = require('express').Router();
const authRoutes = require('./auth.routes');
const appointmentRoutes = require('./appointment.routes');

router.use(authRoutes);
router.use(appointmentRoutes);

module.exports = router;