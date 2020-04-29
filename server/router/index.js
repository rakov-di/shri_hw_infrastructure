const express = require('express');
const router = express.Router();
const { controllersBS } = require('../controllers');

router.get('/', (req, res) => res.status(200).send(String('This is build server')));

router.post('/notify-agent', express.json(), controllersBS.registerAgent);
router.post('/notify-build-result', express.json(), controllersBS.getBuildResult);

module.exports = { router };
