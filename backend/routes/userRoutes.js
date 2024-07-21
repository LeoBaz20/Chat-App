const express = require('express');
const { registerUser, loginUser, authenticateToken, getUsers} = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUsers', authenticateToken, getUsers);

module.exports = router;
