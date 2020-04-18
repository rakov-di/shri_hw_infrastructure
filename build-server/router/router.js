const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.status(200).send(String('This is build server')));

module.exports = { router };
