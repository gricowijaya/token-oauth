const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// login endpoint /api/auth/login
router.get('/auth/login/google', controllers.auth.google);
router.get('/auth/login/facebook', controllers.auth.facebook);

module.exports = router;
