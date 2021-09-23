var express = require('express');
var router = express.Router();
const controller = require('../controllers/utilities.controller')
const passport = require('passport')

router.post('/create',
  passport.authenticate('jwt',{session:false}),
	controller.createState
);
router.post('/create-lga/:stateId',
  passport.authenticate('jwt',{session:false}),
	controller.createLga
);
router.post('/create-pu/:lgaId',
  passport.authenticate('jwt',{session:false}),
	controller.createPollingUnit
);
router.put('/edit-pu/:id',
  passport.authenticate('jwt',{session:false}),
	controller.editPollingUnit
);
router.delete('/delete-pu/:id',
  passport.authenticate('jwt',{session:false}),
	controller.deletePollingUnit
);
router.post('/lga/name',
  passport.authenticate('jwt',{session:false}),
	controller.getALga
);
router.get('/lga/pu/:id',
  passport.authenticate('jwt',{session:false}),
	controller.getLgaPu
);
router.get('/lga',
  passport.authenticate('jwt',{session:false}),
	controller.getLga
);

module.exports = router;
