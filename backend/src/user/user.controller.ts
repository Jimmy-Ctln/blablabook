import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  // mise à jour
  @Patch(':id')
  @ApiResponse({ status: 200, type: UpdateUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRequestDto,
  ) {
    const updatedUser = await this.userService.update(id, body);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // soft delete
  @Patch(':id/soft-delete')
  @ApiResponse({
    status: 200,
    description: 'User soft deleted successfully',
    type: UpdateUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    const deletedUser = await this.userService.softDelete(id);
    return {
      message: 'User deleted successfully',
      deletedUser,
    };
  }
}
