import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  describe('hashPassword', () => {
    it('returns an argon2id hash that is different from the plain password', async () => {
      const hash = await service.hashPassword('my-password');

      expect(hash).not.toBe('my-password');
      // argon2id hashes start with the identifier "$argon2id$"
      expect(hash.startsWith('$argon2id$')).toBe(true);
    });
  });

  describe('checkPassword', () => {
    it('returns true when the password matches its hash', async () => {
      const hash = await service.hashPassword('correct-password');

      const isValid = await service.checkPassword(hash, 'correct-password');

      expect(isValid).toBe(true);
    });

    it('returns false when the password does NOT match its hash', async () => {
      const hash = await service.hashPassword('correct-password');

      const isValid = await service.checkPassword(hash, 'wrong-password');

      expect(isValid).toBe(false);
    });
  });
});
