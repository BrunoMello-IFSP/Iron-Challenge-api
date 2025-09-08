// services/WebSocketService.ts
import { Server, Socket } from 'socket.io';

export class WebSocketService {
  private static io: Server;

  static setIO(io: Server) {
    WebSocketService.io = io;
  }

  static getIO(): Server {
    if (!WebSocketService.io) {
      throw new Error('Socket.IO não inicializado');
    }
    return WebSocketService.io;
  }

  static setupSocketEventHandlers() {
    WebSocketService.io.on('connection', (socket: Socket) => {
      console.log(`Novo cliente conectado: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  //Emitir ranking atualizado para todos os clientes
  static emitRankingUpdate(data: any) {
    console.log(`🔔 Emitindo atualização de ranking para todos os clientes`);
    WebSocketService.io.emit('ranking:update', data);
  }

}
