const express = require('express');
const {authenticateToken, getMessages, deleteMessages} = require('../controllers/messagesController.js')
const router = express.Router();

router.get('/getMessages',authenticateToken, getMessages);
router.delete('/deleteMessages', authenticateToken, deleteMessages);

module.exports = router;
