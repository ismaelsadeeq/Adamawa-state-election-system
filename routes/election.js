var express = require('express');
var router = express.Router();
const controller = require('../controllers/election.controller')
const passport = require('passport')

router.post('/create',
  passport.authenticate('jwt',{session:false}),
	controller.createElection
);
router.get('/election/:id',
  passport.authenticate('jwt',{session:false}),
	controller.getElection
);
router.get('/election-detail/admin',
  passport.authenticate('jwt',{session:false}),
	controller.getElectionDetail
);
// router.get('/election-detail',
//   passport.authenticate('jwt',{session:false}),
// 	controller.getElectionDetail
// );
router.get('/publish/:id',
  passport.authenticate('jwt',{session:false}),
	controller.publishElection
);
router.post('/submit/:id',
  passport.authenticate('jwt',{session:false}),
	controller.submitResult
);

module.exports = router;
