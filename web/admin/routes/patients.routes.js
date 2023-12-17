const router = require('express').Router();
const { PatientsController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');


router.get('/lists', AuthMiddleware.authenticateToken , PatientsController.list );

module.exports = router;
