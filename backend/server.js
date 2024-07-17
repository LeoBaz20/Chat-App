const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { setupWebSocket } = require('./websocket/websocket');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3002;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
