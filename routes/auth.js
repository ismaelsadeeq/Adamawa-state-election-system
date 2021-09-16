var express = require('express');
var router = express.Router();
const controller = require('../controllers/auth.controller')
const passport = require('passport')

router.post('/login',
	controller.login
);
router.post('/admin-login',
	controller.adminLogin
);
router.post('/register',
	controller.register
);
router.post('/admin-register',
	controller.adminRegister
);
router.get('/logout',
	passport.authenticate('jwt',{session:false}),
	controller.logout
);
module.exports = router;
