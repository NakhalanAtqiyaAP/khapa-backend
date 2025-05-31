const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 

router.post('/login', userController.loginUser);

module.exports = router; 