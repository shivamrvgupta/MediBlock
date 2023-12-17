const router = require('express').Router();
const { DoctorController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');


router.get('/lists', AuthMiddleware.authenticateToken , DoctorController.list );
router.get('/add', AuthMiddleware.authenticateToken , DoctorController.getAdd );
router.get('/update/:doctor_id', AuthMiddleware.authenticateToken , DoctorController.getUpdate );

router.post('/add', MulterMiddleware.upload.fields([
    { name: 'doctor_image', maxCount: 1 }
  ]),
    AuthMiddleware.authenticateToken ,DoctorController.postAdd);

router.post('/update/:doctor_id', AuthMiddleware.authenticateToken , MulterMiddleware.upload.fields([
  { name: 'doctor_image', maxCount: 1 }
]) ,DoctorController.updateAdd);

module.exports = router;
