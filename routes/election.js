var express = require('express');
var router = express.Router();
const controller = require('../controllers/election.controller')
const passport = require('passport')

router.post('/create',
  passport.authenticate('jwt',{session:false}),
	controller.createElection
);
router.post('/create/party',
  passport.authenticate('jwt',{session:false}),
	controller.createParty
);
router.put('/edit/party/:id',
  passport.authenticate('jwt',{session:false}),
	controller.editParty
);
router.delete('/party/:id',
  passport.authenticate('jwt',{session:false}),
	controller.deleteParty
);
router.get('/admin',
  passport.authenticate('jwt',{session:false}),
	controller.getElectionDetailAdmin
);
router.get('/detail',
	controller.getElectionDetail
);
router.put('/publish',
  passport.authenticate('jwt',{session:false}),
	controller.publishElection
);
router.put('/un-publish',
  passport.authenticate('jwt',{session:false}),
	controller.unPublishElection
);
router.post('/submit',
  passport.authenticate('jwt',{session:false}),
	controller.submitResult
);
router.get('/',
	controller.getElection
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
	controller.deleteElection
);
module.exports = router;
