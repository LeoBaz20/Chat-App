const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { setupWebSocket } = require('./websocket/websocket');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes')

const app = express();
const port = process.env.PORT || 3002;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
