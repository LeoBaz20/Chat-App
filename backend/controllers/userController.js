const { createUser, findUserByEmail, getAllUsers } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // No hay token
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token no válido
    }
    req.user = user;
    next(); // Continúa al siguiente middleware o ruta
  });
};

async function registerUser(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya está registrado' });
    }
    const user = await createUser(email, password, name);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.log(error);
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

async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}


module.exports = { registerUser, loginUser, authenticateToken, getUsers };
