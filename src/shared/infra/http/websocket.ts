
import { WebSocketService } from '@/services/WebSocketService';
import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';



let ioInstance: Server | null = null;

export const setupWebSocket = (httpServer: HTTPServer): Server => {
  if (ioInstance) {
    return ioInstance;
  }

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  ioInstance = io;


  WebSocketService.setIO(io);


  WebSocketService.setupSocketEventHandlers();

  console.log('WebSocket server running 🚀');

  return io;
};

export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error('WebSocket não inicializado. Chame setupWebSocket primeiro.');
  }
  return ioInstance;
};
