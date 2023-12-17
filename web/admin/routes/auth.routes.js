const router = require('express').Router();
const { AuthController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');


router.post('/login', AuthController.verifyLogin);

router.get('/dashboard', AuthMiddleware.authenticateToken ,AuthController.getdashboard );

router.get('/sales-data', AuthMiddleware.authenticateToken ,AuthController.getMonthlyData );

router.post('/logout', AuthMiddleware.authenticateToken ,AuthController.logout );

module.exports = router;
