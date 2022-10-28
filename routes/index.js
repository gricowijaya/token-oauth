const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// login endpoint /api/auth/login
router.use('/auth/login', controllers.auth.google);

module.exports = router;
