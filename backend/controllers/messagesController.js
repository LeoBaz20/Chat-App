const {getMessagesById, deleteMessagesById} = require('../models/messagesModel');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); // No hay token
    }
  
    jwt.verify(token, process.env.JWT_TOKEN, (err, message) => {
      if (err) {
        return res.sendStatus(403); // Token no válido
      }
      req.message = message;
      next(); // Continúa al siguiente middleware o ruta
    });
  };

  async function getMessages(req, res) {
    const { senderId, targetUserId } = req.query;

    if (!senderId || !targetUserId) {
      return res.status(400).json({ error: 'senderId and targetUserId are required' });
    }

    try {
      const messages = await getMessagesById(senderId, targetUserId);
      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ error: 'Error getting messages' });
    }
  }

  async function deleteMessages(req, res) {
    const { senderId, targetUserId } = req.query;

    if (!senderId || !targetUserId) {
      return res.status(400).json({ error: 'senderId and targetUserId are required' });
    }

    try {
      await deleteMessagesById(senderId, targetUserId);
      res.status(200).json({success: 'Messages have been deleted'})
    } catch (error) {
      res.status(500).json({ error: 'Error deleting messages' });
    }
  }

module.exports = {authenticateToken, getMessages, deleteMessages};