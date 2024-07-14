const express = require('express');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { getUserById } = require('./models/userModel');

const app = express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:3000',  // URL de tu frontend
  optionsSuccessStatus: 200,  // Algunas versiones antiguas de navegadores (IE11, varios SmartTVs) chocan con 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// Servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Servidor WebSocket
const wss = new WebSocketServer({ server });

let connectedUsers = [];

const broadcastConnectedUsers = () => {
  const users = connectedUsers.map(user => user.userInfo);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: 'connectedUsers', users }));
    }
  });
};

wss.on('connection', (ws, req) => {
  console.log('Cliente conectado al WebSocket');

  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'authenticate') {
      const token = parsedMessage.token;
      if (!token) {
        ws.send(JSON.stringify({ type: 'error', message: 'Token no proporcionado' }));
        ws.close();
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decoded.userId;
        const userInfo = await getUserById(userId);
        ws.userId = userId;
        ws.userInfo = userInfo;
        connectedUsers.push({ws,userInfo});
        ws.send(JSON.stringify({ type: 'authenticated', message: 'Autenticado correctamente' }));
        broadcastConnectedUsers();
      } catch (err) {
        console.error("Error:", err);
        ws.send(JSON.stringify({ type: 'error', message: 'Token inválido' }));
        ws.close();
        return;
      }
    } else {
      console.log(`Mensaje recibido: ${message}`);
      ws.send('Mensaje recibido por el servidor');
    }
  });

  ws.on('close', async () => {
    console.log('Cliente desconectado del WebSocket');
    if (ws.userId) {
      connectedUsers = connectedUsers.filter(user => user.ws !== ws);
      // Enviar la lista actualizada de usuarios conectados a todos los clientes
      broadcastConnectedUsers();
    }
  });
});
