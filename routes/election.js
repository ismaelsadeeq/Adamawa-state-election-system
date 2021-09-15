var express = require('express');
var router = express.Router();
const controller = require('../controllers/utilities.controller')
const passport = require('passport')

router.post('/create-election',
  passport.authenticate('jwt',{session:false}),
	controller.createElection
);
module.exports = router;
