import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';
import { UserController } from '../../utils/decorators/api-controllers.decorator';

@UserController('auth/apple', { isPublic: true, tagName: 'auth' })
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAppleService: AuthAppleService,
  ) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthAppleLoginDto): Promise<LoginResponseDto> {
    const socialData = await this.authAppleService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin('apple', socialData);
  }
}
