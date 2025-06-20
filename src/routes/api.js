const express = require('express');
const router = express.Router();
const restakerController = require('../controllers/restakerController');
const validatorController = require('../controllers/validatorController');
const rewardController = require('../controllers/rewardController');

router.get('/restakers', restakerController.getRestakers);
router.get('/validators', validatorController.getValidators);
router.get('/rewards/:address', rewardController.getRewardsByAddress);

module.exports = router;