const express = require('express');
const router = express.Router();
const { agentControllers } = require('../controllers');

router.get('/', (req, res) => res.status(200).send(String('This is build server')));

router.post('/notify-agent', agentControllers.registerAgent);
router.post('/notify-build-result', agentControllers.getBuildResult);

module.exports = { router };
