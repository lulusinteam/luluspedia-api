import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly webhookUrl: string | undefined;

  constructor(private configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('WEBHOOK_URL', {
      infer: true,
    });
  }

  async send(data: any): Promise<void> {
    if (!this.webhookUrl) {
      return;
    }

    try {
      // Discord-compatible format by default (using 'content' field)
      const payload = typeof data === 'string' ? { content: data } : data;

      await axios.post(this.webhookUrl, payload);
    } catch (error) {
      console.error('Failed to send webhook notification:', error.message);
    }
  }
}
