import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  connectToRedis(): void {
    const url = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    
    console.log(`[RedisIoAdapter] Connecting to Redis at: ${url.split('@')[1] || url}`);

    const pubClient = new Redis(url, {
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
      console.error('[RedisIoAdapter] PubClient Error:', err.message);
    });

    subClient.on('error', (err) => {
      console.error('[RedisIoAdapter] SubClient Error:', err.message);
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
