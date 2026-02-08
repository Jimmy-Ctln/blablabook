import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from '../security/password/password.service';
import { CookieService } from 'src/security/cookie/cookie.service';
import { TokenService } from 'src/security/token/token.service';
import { TokenRepository } from 'src/security/token/token.respository';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'mimixlatrix',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    CookieService,
    TokenService,
    TokenRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
