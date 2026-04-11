import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

// Mock argon2 au niveau du module
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

// Mock de la BD
jest.mock('../db/index', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
  },
}));

describe('UserService', () => {
  let service: UserService;
  let mockDb: any;
  let mockArgon2Hash: jest.Mock;
  let mockArgon2Verify: jest.Mock;

  beforeEach(async () => {
    const { db } = require('../db/index');
    mockDb = db;

    mockArgon2Hash = argon2.hash as jest.Mock;
    mockArgon2Verify = argon2.verify as jest.Mock;

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user with normalized email', async () => {
      const userInputData = {
        email: 'NEWUSER@EXAMPLE.COM',
        username: 'newuser',
        password: 'test_password',
      };

      const createdUser = {
        id: 1,
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'test_password',
        role: 'USER',
      };

      const mockChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([createdUser]),
      };
      mockDb.insert.mockReturnValue(mockChain);

      const result = await service.createUser(userInputData);

      expect(result).toBeDefined();
      expect(result.email).toBe('newuser@example.com');
    });

    it('should return null if no user returned from database', async () => {
      const userInputData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };

      const mockChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };
      mockDb.insert.mockReturnValue(mockChain);

      const result = await service.createUser(userInputData);

      expect(result).toBeNull();
    });
  });

  describe('getUserByUsername', () => {
    it('should find user by username case-insensitive', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        deletedAt: null,
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUser]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.getUserByUsername('TESTUSER');

      expect(result).toBeDefined();
      expect(result.username).toBe('testuser');
    });

    it('should return null when username not found', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.getUserByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should find user by email with normalization', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'USER',
        deletedAt: null,
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUser]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.getUserByEmail('TEST@EXAMPLE.COM');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should return null when email not found', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('checkUserExisting', () => {
    it('should find user by username or email', async () => {
      const mockUser = {
        id: 1,
        username: 'existing',
        email: 'existing@example.com',
        deletedAt: null,
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUser]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.checkUserExisting(
        'existing',
        'other@example.com',
      );

      expect(result).toBeDefined();
      expect(result.username).toBe('existing');
    });

    it('should return null when neither username nor email exists', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.checkUserExisting(
        'newuser',
        'new@example.com',
      );

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        deletedAt: null,
      };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockUser]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      const result = await service.findById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const updateDto = { username: 'newname' };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValue([{ id: 1, username: 'newname' }]),
      };

      mockDb.select.mockReturnValue(mockSelectChain);
      mockDb.update.mockReturnValue(mockUpdateChain);

      const result = await service.update(1, updateDto);

      expect(result).toBeDefined();
      expect(result.username).toBe('newname');
    });

    it('should throw UnprocessableEntityException if email already in use', async () => {
      const updateDto = { email: 'existing@example.com' };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest
          .fn()
          .mockResolvedValue([{ id: 2, email: 'existing@example.com' }]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should throw NotFoundException if user not found during update', async () => {
      const updateDto = { username: 'newname' };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelectChain);
      mockDb.update.mockReturnValue(mockUpdateChain);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should hash password when updating password', async () => {
      const updateDto = { password: 'newpassword' };

      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 1, password: 'hashed' }]),
      };

      mockDb.select.mockReturnValue(mockSelectChain);
      mockDb.update.mockReturnValue(mockUpdateChain);
      mockArgon2Hash.mockResolvedValue('hashedpw');

      await service.update(1, updateDto);

      expect(mockArgon2Hash).toHaveBeenCalledWith('newpassword');
    });
  });

  describe('softDelete', () => {
    it('should throw NotFoundException if user not found', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
    });

    it('should anonymize user during soft delete', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest
          .fn()
          .mockResolvedValue([{ id: 1, email: 'test@example.com' }]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValueOnce(mockSelectChain);
      mockDb.update.mockReturnValueOnce(mockUpdateChain);

      const mockDeleteChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([
          {
            id: 1,
            email: 'deleted_1@anonymized.local',
            username: 'DeletedUser_1',
            deletedAt: new Date(),
          },
        ]),
      };

      mockDb.update.mockReturnValueOnce(mockDeleteChain);
      mockArgon2Hash.mockResolvedValue('hashedphantom');

      const result = await service.softDelete(1);

      expect(result).toBeDefined();
      expect(result.email).toContain('anonymized');
    });
  });

  describe('changePassword', () => {
    it('should throw NotFoundException if user not found', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);

      await expect(
        service.changePassword(1, 'oldpass', 'newpass'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should verify current password before changing', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 1,
            password: 'hashed_old_password',
          },
        ]),
      };
      mockDb.select.mockReturnValue(mockSelectChain);
      mockArgon2Verify.mockResolvedValue(false);

      await expect(
        service.changePassword(1, 'wrong_password', 'newpass'),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(mockArgon2Verify).toHaveBeenCalledWith(
        'hashed_old_password',
        'wrong_password',
      );
    });

    it('should hash and update new password', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 1,
            password: 'hashed_old_password',
          },
        ]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValue([{ id: 1, password: 'hashed_new' }]),
      };

      mockDb.select.mockReturnValue(mockSelectChain);
      mockDb.update.mockReturnValue(mockUpdateChain);

      mockArgon2Verify.mockResolvedValue(true);
      mockArgon2Hash.mockResolvedValue('hashed_new_password');

      const result = await service.changePassword(1, 'oldpass', 'newpass');

      expect(mockArgon2Hash).toHaveBeenCalledWith('newpass');
      expect(mockUpdateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashed_new_password',
        }),
      );
    });

    it('should throw NotFoundException if update fails', async () => {
      const mockSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ id: 1, password: 'hashed_old' }]),
      };

      const mockUpdateChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      mockDb.select.mockReturnValue(mockSelectChain);
      mockDb.update.mockReturnValue(mockUpdateChain);

      mockArgon2Verify.mockResolvedValue(true);
      mockArgon2Hash.mockResolvedValue('hashed_new_password');

      await expect(
        service.changePassword(1, 'oldpass', 'newpass'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
