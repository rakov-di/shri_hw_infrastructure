const express = require('express');
const router = express.Router();
// const { bsControllers } = require('../controllers');

router.get('/', (req, res) => res.status(200).send(String('This is build agent')));

// router.post('/build', express.json(), agentControllers.starBuildt);

module.exports = { router };
