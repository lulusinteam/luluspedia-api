import { Injectable } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationRepository } from '../infrastructure/persistence/notification.repository';
import { User } from '../../users/domain/user';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Notification } from '../domain/notification';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly templateService: NotificationTemplateService,
    private readonly gateway: NotificationsGateway,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  /**
   * Sending notification to a specific user (System notification + Unread Count logic)
   */
  async notifyUser(
    userId: string,
    templateName: string,
    context: any,
  ): Promise<void> {
    const message = this.templateService.render(templateName, context);

    // Save to database for persistence and unread count tracking
    await this.notificationRepository.create({
      user: { id: userId } as User,
      title: context.title || 'Notification',
      message: message,
      isRead: false,
    });

    // Update unread count for the user via websocket
    const count = await this.notificationRepository.countUnreadByUserId(userId);
    this.gateway.emitUnreadCount(userId, count);

    // Also send via webhook (generic platform alert)
    await this.webhookService.send({
      content: message,
    });
  }

  // Broad platform-wide notification (Admin-focused, no unread count per user here)
  async notify(templateName: string, context: any): Promise<void> {
    const message = this.templateService.render(templateName, context);
    await this.webhookService.send({
      content: message,
    });
  }

  /**
   * Mark notification as read and push updated count
   */
  async markRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
    const count = await this.notificationRepository.countUnreadByUserId(userId);
    this.gateway.emitUnreadCount(userId, count);
  }

  /**
   * Get current unread count for a user (useful for initial load)
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  /**
   * Get all notifications for a user (paginated)
   */
  async findAllWithPagination(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<[Notification[], number]> {
    return this.notificationRepository.findManyWithPagination({
      userId,
      paginationOptions,
    });
  }

  // --- Convenience methods (Updated to include User ID for unread count logic if applicable) ---

  async notifyTryoutPublished(tryoutTitle: string): Promise<void> {
    await this.notify('tryout-published', { title: tryoutTitle });
  }

  async notifyTryoutResult(
    userId: string,
    tryoutTitle: string,
    userFullName: string,
    score: number,
  ): Promise<void> {
    await this.notifyUser(userId, 'tryout-result', {
      title: 'Hasil Tryout Sudah Keluar',
      tryout: tryoutTitle,
      user: userFullName,
      score,
    });
  }

  async notifyNewReview(
    userName: string,
    tryoutTitle: string,
    rating: number,
    comment: string,
  ): Promise<void> {
    await this.notify('new-review', {
      title: 'New Review Received',
      user: userName,
      tryout: tryoutTitle,
      rating,
      comment,
    });
  }

  async notifyUserRegistered(
    userId: string,
    userFullName: string,
    email: string,
  ): Promise<void> {
    await this.notifyUser(userId, 'user-registered', {
      title: 'Selamat Datang di Luluspedia',
      user: userFullName,
      email,
    });
  }

  async notifyAuthLogin(userId: string, userEmail: string): Promise<void> {
    await this.notifyUser(userId, 'auth-login', {
      title: 'Keamanan: Login Berhasil',
      email: userEmail,
    });
  }

  async notifyAuthPasswordReset(
    userId: string,
    userEmail: string,
  ): Promise<void> {
    await this.notifyUser(userId, 'auth-password-reset', {
      title: 'Keamanan: Password Diubah',
      email: userEmail,
    });
  }

  async notifyWishlistAdded(
    userId: string,
    userFullName: string,
    tryoutTitle: string,
  ): Promise<void> {
    await this.notifyUser(userId, 'wishlist-added', {
      title: 'Tryout Masuk Wishlist',
      user: userFullName,
      tryout: tryoutTitle,
    });
  }
}
