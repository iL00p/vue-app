const express = require('express');
const passport = require('passport');
const usersController = require('./users.controller');
const router = express.Router();

router.get('/', usersController.getAllUsers);

router.get('/me', passport.authenticate('jwt', { session : false }),usersController.getAllUsers);

module.exports = router;