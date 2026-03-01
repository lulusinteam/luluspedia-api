import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from '../strategies/anonymous.strategy';
import { MailModule } from '../../mail/mail.module';
import { SessionModule } from '../../session/session.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AdminAuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
})
export class AdminAuthModule {}
