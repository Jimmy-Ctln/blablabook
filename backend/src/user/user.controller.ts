import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  BadRequestException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { ChangePasswordRequestDto } from './dto/change-password.request.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Patch('change-password')
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 422,
    description: 'Current password is incorrect',
  })
  async changePassword(
    @Req() request: Request,
    @Body() body: ChangePasswordRequestDto,
  ) {
    const userId = request['user']?.sub;
    if (!userId) {
      throw new BadRequestException('User not found in request');
    }
    return this.userService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userId = request['user']?.sub;
    if (!userId) {
      throw new BadRequestException('User not found in request');
    }
    if (userId !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRequestDto,
    @Req() request: Request,
  ) {
    const userId = request['user']?.sub;
    if (!userId) {
      throw new BadRequestException('User not found in request');
    }
    if (userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const updatedUser = await this.userService.update(id, body);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @UseGuards(AuthGuard)
  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAccount(@Req() request: Request) {
    const userId = request['user']?.sub;
    if (!userId) {
      throw new BadRequestException('User not found in request');
    }
    return this.userService.softDelete(userId);
  }
}
