import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    mockUserService = {
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      changePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findById', () => {
    it('should return user for valid userId', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        username: 'testuser',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const mockRequest = {
        user: { sub: 1 },
      } as any;

      const result = await controller.findById(1, mockRequest);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should return error for non-existent user', async () => {
      mockUserService.findById.mockResolvedValue(null);

      const mockRequest = {
        user: { sub: 999 },
      } as any;

      const result = await controller.findById(999, mockRequest);

      expect(result).toBeNull();
    });

    it('should throw ForbiddenException when accessing other user profile', async () => {
      const mockRequest = {
        user: { sub: 1 },
      } as any;

      // User 1 trying to access user 2's profile should fail
      await expect(controller.findById(2, mockRequest)).rejects.toThrow(
        'You can only access your own profile',
      );
    });
  });

  describe('update', () => {
    it('should update user profile successfully', async () => {
      const updateDto = {
        username: 'newusername',
        email: 'newemail@example.com',
      };

      const updatedUser = {
        id: 1,
        email: updateDto.email,
        username: updateDto.username,
        role: 'USER',
      };

      mockUserService.update.mockResolvedValue(updatedUser);

      const mockRequest = { user: { sub: 1 } } as any;
      const result = await controller.update(1, updateDto, mockRequest);

      expect(result.user).toEqual(updatedUser);
    });

    it('should handle empty update request', async () => {
      const updateDto = {};

      const existingUser = {
        id: 1,
        email: 'user@example.com',
        username: 'testuser',
        role: 'USER',
      };

      mockUserService.update.mockResolvedValue(existingUser);

      const mockRequest = { user: { sub: 1 } } as any;
      const result = await controller.update(1, updateDto, mockRequest);

      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException when updating other user', async () => {
      const updateDto = { username: 'hacker' };

      const mockRequest = { user: { sub: 1 } } as any;

      // User 1 trying to update user 2's profile should fail
      await expect(
        controller.update(2, updateDto, mockRequest),
      ).rejects.toThrow('You can only update your own profile');
    });
  });

  describe('deleteAccount (GDPR)', () => {
    it('should soft delete user account', async () => {
      mockUserService.softDelete.mockResolvedValue({
        id: 1,
        deletedAt: new Date(),
      });

      const mockRequest = { user: { sub: 1 } } as any;
      const result = await controller.deleteAccount(mockRequest);

      expect(result).toBeDefined();
      expect(mockUserService.softDelete).toHaveBeenCalledWith(1);
    });

    it('should soft delete with anonymization', async () => {
      const anonymizedUser = {
        id: 1,
        email: '',
        username: '',
        deletedAt: new Date(),
      };

      mockUserService.softDelete.mockResolvedValue(anonymizedUser);

      const mockRequest = { user: { sub: 1 } } as any;
      const result = await controller.deleteAccount(mockRequest);

      expect(result.email).toBe('');
      expect(result.username).toBe('');
      expect(result.deletedAt).toBeDefined();
    });
  });

  describe('changePassword', () => {
    it('should change user password successfully', async () => {
      const changePasswordDto = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass456',
      };

      mockUserService.changePassword.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
      });

      const mockRequest = { user: { sub: 1 } } as any;
      const result = await controller.changePassword(
        mockRequest,
        changePasswordDto,
      );

      expect(result).toBeDefined();
    });

    it('should handle password change error', async () => {
      const changePasswordDto = {
        currentPassword: 'wrongpass',
        newPassword: 'newpass456',
      };

      mockUserService.changePassword.mockRejectedValue(
        new Error('Current password is incorrect'),
      );

      const mockRequest = { user: { sub: 1 } } as any;

      await expect(
        controller.changePassword(mockRequest, changePasswordDto),
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('User Operations', () => {
    it('should complete user profile update workflow', async () => {
      // 1. Find user
      mockUserService.findById.mockResolvedValue({
        id: 1,
        username: 'oldname',
        email: 'old@example.com',
      });

      // 2. Update user
      mockUserService.update.mockResolvedValue({
        id: 1,
        username: 'newname',
        email: 'old@example.com',
      });

      const mockRequest = { user: { sub: 1 } } as any;

      const userBefore = await controller.findById(1, mockRequest);
      expect(userBefore.username).toBe('oldname');

      const updateResult = await controller.update(
        1,
        {
          username: 'newname',
        },
        mockRequest,
      );
      expect(updateResult).toBeDefined();
    });
  });
});
