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
    expect(result.email).toBe('newuser@example.com');
    expect(result.username).toBe('newuser');
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
    expect(result.email).toBe('test@example.com');
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
    expect(result.username).toBe('existing');
  });
});
