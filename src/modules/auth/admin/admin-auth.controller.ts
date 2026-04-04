import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthEmailLoginDto } from '../dto/auth-email-login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ApiJSendResponse } from '../../../utils/swagger-jsend.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RefreshResponseDto } from '../dto/refresh-response.dto';
import { User } from '../../users/domain/user';
import { NullableType } from '../../../utils/types/nullable.type';
import { AuthUpdateDto } from '../dto/auth-update.dto';
import { AdminController } from '../../../utils/decorators/api-controllers.decorator';

@AdminController('auth', { isPublic: true })
export class AdminAuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({ groups: ['me'] })
  @Post('email/login')
  @ApiJSendResponse(LoginResponseDto)
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    return this.service.validateLogin(loginDto, RoleEnum.admin);
  }

  @SerializeOptions({ groups: ['me'] })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiJSendResponse(User)
  public me(@Request() request): Promise<NullableType<User>> {
    return this.service.me(request.user);
  }

  @SerializeOptions({ groups: ['me'] })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiJSendResponse(RefreshResponseDto)
  public refresh(@Request() request): Promise<RefreshResponseDto> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({ sessionId: request.user.sessionId });
  }

  @SerializeOptions({ groups: ['me'] })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiJSendResponse(User)
  public update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() request): Promise<void> {
    return this.service.softDelete(request.user);
  }
}
