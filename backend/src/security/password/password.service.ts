import { Injectable, InternalServerErrorException } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class PasswordService {
  constructor() {}

  async checkPassword(hashPwd: string, plainPwd: string): Promise<boolean> {
    try {
      return await argon2.verify(hashPwd, plainPwd);
    } catch (err) {
      console.error(
        'password verify failed:',
        err instanceof Error ? err.message : 'unknown',
      );
      return false;
    }
  }

  async hashPassword(pwd: string): Promise<string> {
    try {
      return await argon2.hash(pwd);
    } catch (err) {
      console.error(
        'password hash failed:',
        err instanceof Error ? err.message : 'unknown',
      );
      throw new InternalServerErrorException('hash failed');
    }
  }
}
