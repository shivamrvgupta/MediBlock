const router = require('express').Router();
const { AppointmentController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../../../managers/middlewares')



router.get('/appointment', AuthMiddleware.authenticateToken , AppointmentController.getAppointment );
router.get('/send-scan/:DocID', AuthMiddleware.authenticateToken , AppointmentController.getScan );

router.post('/send-scan',  MulterMiddleware.upload.fields([
    { name: 'mri_report', maxCount: 1 }
  ]),
    AuthMiddleware.authenticateToken , AppointmentController.postScan );

module.exports = router;
