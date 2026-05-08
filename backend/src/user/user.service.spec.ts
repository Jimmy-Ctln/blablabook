import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

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

  beforeEach(async () => {
    const { db } = require('../db/index');
    mockDb = db;

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const userInputData = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
    };

    const createdUser = {
      id: 1,
      email: userInputData.email,
      username: userInputData.username,
      password: userInputData.password,
      role: 'USER',
    };

    const mockChain = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([createdUser]),
    };
    mockDb.insert.mockReturnValue(mockChain);

    const result = await service.createUser(userInputData);

    expect(result).toBeDefined();
    expect(result!.email).toBe('newuser@example.com');
    expect(result!.username).toBe('newuser');
  });

  it('should get user by email', async () => {
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

    const result = await service.getUserByEmail('test@example.com');

    expect(result).toBeDefined();
    expect(result!.email).toBe('test@example.com');
  });

  it('should check if user exists by username or email', async () => {
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
    expect(result!.username).toBe('existing');
  });

  it('should get user by username', async () => {
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

    const result = await service.getUserByUsername('testuser');

    expect(result).toBeDefined();
    expect(result!.username).toBe('testuser');
  });

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

  it('should throw error when user not found by id', async () => {
    const mockSelectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };
    mockDb.select.mockReturnValue(mockSelectChain);

    await expect(service.findById(999)).rejects.toThrow(
      'User with id 999 not found',
    );
  });

  it('should update user successfully', async () => {
    const updateData = {
      username: 'updateduser',
      email: 'updated@example.com',
    };

    const existingUser = { id: 1, email: 'other@example.com' };
    const updatedUser = { id: 1, ...updateData, role: 'USER', deletedAt: null };

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([updatedUser]),
    };

    mockDb.select.mockReturnValue(selectChain);
    mockDb.update.mockReturnValue(updateChain);

    const result = await service.update(1, updateData);

    expect(result).toBeDefined();
    expect(updateChain.set).toHaveBeenCalled();
  });

  it('should throw error when email already in use', async () => {
    const updateData = { email: 'existing@example.com' };

    const existingUser = { id: 2, email: 'existing@example.com' };

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([existingUser]),
    };

    mockDb.select.mockReturnValue(selectChain);

    await expect(service.update(1, updateData)).rejects.toThrow(
      'Email already in use',
    );
  });

  it('should change password successfully', async () => {
    const { verify } = require('argon2');
    const mockUser = {
      id: 1,
      password: 'hashed_old_password',
      deletedAt: null,
    };

    verify.mockResolvedValue(true);

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
    };

    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockUser]),
    };

    mockDb.select.mockReturnValue(selectChain);
    mockDb.update.mockReturnValue(updateChain);

    const result = await service.changePassword(
      1,
      'old_password',
      'new_password',
    );

    expect(result).toBeDefined();
    expect(result.message).toBe('Password changed successfully');
  });

  it('should throw error when current password is incorrect', async () => {
    const { verify } = require('argon2');
    const mockUser = {
      id: 1,
      password: 'hashed_old_password',
      deletedAt: null,
    };

    verify.mockResolvedValue(false);

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
    };

    mockDb.select.mockReturnValue(selectChain);

    await expect(
      service.changePassword(1, 'wrong_password', 'new_password'),
    ).rejects.toThrow('Current password is incorrect');
  });

  it('should soft delete user with anonymization', async () => {
    const mockUser = { id: 1, email: 'test@example.com', deletedAt: null };

    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
    };

    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest
        .fn()
        .mockResolvedValue([{ ...mockUser, deletedAt: new Date() }]),
    };

    mockDb.select
      .mockReturnValueOnce(selectChain)
      .mockReturnValueOnce(updateChain);
    mockDb.update.mockReturnValue(updateChain);

    const result = await service.softDelete(1);

    expect(result).toBeDefined();
    expect(updateChain.set).toHaveBeenCalled();
  });
});
