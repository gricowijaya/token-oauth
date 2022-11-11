const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// login endpoint /api/auth/login
router.get('/auth/login/google', controllers.auth.google);
router.get('/auth/login/facebook', controllers.auth.facebook);

// debug sentry the integration
router.get('/debug/sentry', controllers.sentry.mainHandler);

// sending endpoint
router.get('/mailer/send-email', controllers.mailer.sendEmail);

module.exports = router;
