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
    origin: '*',
    credentials: true,
  },
  namespace: 'notifications', // Putting this back as frontend expects it
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
      console.log(`[NotificationsGateway] Attempting connection: ${client.id}`);

      // Basic JWT verification from handshake auth, query or headers
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        console.warn(
          `[NotificationsGateway] ❌ connection rejected: No token provided for client ${client.id}`,
        );
        client.disconnect();
        return;
      }

      try {
        const payload = await this.jwtService.verifyAsync(token as string, {
          secret: this.configService.get('auth.secret', { infer: true }),
        });

        const userId = payload.id;
        await client.join(`user_${userId}`);
        console.log(
          `[NotificationsGateway] ✅ User ${userId} connected to notification socket`,
        );
      } catch (jwtError) {
        console.error(
          `[NotificationsGateway] ❌ JWT Verification Failed for client ${client.id}:`,
          jwtError.message,
        );
        client.disconnect();
      }
    } catch (error) {
      console.error(
        '[NotificationsGateway] ❌ Connection error:',
        error.message,
      );
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`[NotificationsGateway] 🔌 Socket disconnected: ${client.id}`);
  }

  /**
   * Broadcast unread count to a specific user
   */
  emitUnreadCount(userId: string, count: number) {
    console.log(
      `[NotificationsGateway] 📢 Emitting unreadCount (${count}) to user_${userId}`,
    );
    this.server.to(`user_${userId}`).emit('unreadCount', { count });
  }
}
