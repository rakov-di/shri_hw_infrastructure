const express = require('express');
const router = express.Router();
const { bsControllers } = require('../controllers');

router.get('/', (req, res) => res.status(200).send(String('This is build server')));

router.post('/notify-agent', express.json(), bsControllers.registerAgent);
router.post('/notify-build-result', express.json(), bsControllers.getBuildResult);

module.exports = { router };
