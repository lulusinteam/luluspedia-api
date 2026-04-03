import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust to your frontend URL
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      // Basic JWT verification from handshake query or headers
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });

      // Join a private room for this specific user
      const userId = payload.id;
      await client.join(`user_${userId}`);
      console.log(`User ${userId} connected to notification socket`);
    } catch (error) {
      console.error('Socket connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  /**
   * Broadcast unread count to a specific user
   */
  emitUnreadCount(userId: string, count: number) {
    this.server.to(`user_${userId}`).emit('unreadCount', { count });
  }
}
