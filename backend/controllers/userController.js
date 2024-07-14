const { createUser, findUserByEmail, getUserByConnection } = require('../models/userModel');
const connectedUsers = require('../connectionManager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
  const { email, password, name } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya está registrado' });
    }
    const user = await createUser(email, password, name);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign({ userId: user.id, name: user.name}, process.env.JWT_TOKEN , { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al autenticar el usuario' });
  }
}


module.exports = { registerUser, loginUser };
