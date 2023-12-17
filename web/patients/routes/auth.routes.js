const router = require('express').Router();
const { AuthController } = require('../controllers');
const { AuthMiddleware } = require('../../../managers/middlewares')



router.get('/', AuthMiddleware.authenticateToken ,AuthController.getHome );
router.get('/about', AuthMiddleware.authenticateToken,AuthController.getAbout );
router.get('/doctors', AuthMiddleware.authenticateToken,AuthController.getDoctor );
router.get('/contact-us', AuthMiddleware.authenticateToken,AuthController.getContact );
router.get('/patient-register', AuthMiddleware.authenticateToken,AuthController.getRegistration );
router.get('/terms-conditions', AuthMiddleware.authenticateToken,AuthController.getTerms );
router.get('/code-of-conduct', AuthMiddleware.authenticateToken,AuthController.codeOfConduct );
router.get('/appointment', AuthMiddleware.authenticateToken,AuthController.getAppointment );
router.get('/patient-login', AuthController.getLogin );
router.get('/dashboard', AuthMiddleware.authenticateToken, AuthController.getDashboard );


router.post('/patient-register', AuthController.postRegistration );
router.post('/patient-login', AuthController.postLogin );

module.exports = router;
