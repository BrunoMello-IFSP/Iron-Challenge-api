import 'reflect-metadata';
import 'express-async-errors';
import '@/configs/dotenv';

import http from 'http';

import { app } from './app';
import { setupWebSocket } from './websocket';

const port = process.env.PORT || 3333;
const server = http.createServer(app);

// Inicializa o WebSocket
setupWebSocket(server);

server.listen(port, () => {
  console.log(`API rodando na porta ${port}!`);
});


