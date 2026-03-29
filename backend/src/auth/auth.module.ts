import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from '../security/password/password.service';
import { CookieService } from 'src/security/cookie/cookie.service';
import { TokenService } from 'src/security/token/token.service';
import { UserModule } from 'src/user/user.module';
import { TokenRepository } from 'src/security/token/token.respository';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    PasswordService,
    CookieService,
    TokenService,
    TokenRepository,
  ],
  exports: [AuthService, AuthGuard, TokenService, CookieService],
})
export class AuthModule {}
