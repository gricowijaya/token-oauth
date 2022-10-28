const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// login endpoint /api/auth/login
router.use('/auth/login', controllers.auth.google);
router.use('/auth/login/facebook', controllers.auth.facebook);

module.exports = router;
