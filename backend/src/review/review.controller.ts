import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import type { RequestWithUser } from '@/auth/types';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @Get('book/:bookId')
  @ApiOperation({ summary: 'Get all reviews for a book' })
  getReviews(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.reviewService.getReviewsByBookId(bookId);
  }

  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a review for a book' })
  createReview(@Body() dto: CreateReviewDto, @Req() request: RequestWithUser) {
    const userId = request['user']?.sub;
    if (!userId) throw new BadRequestException('User not found in request');
    return this.reviewService.createReview(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Delete(':reviewId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Soft-delete own review' })
  deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Req() request: RequestWithUser,
  ) {
    const userId = request['user']?.sub;
    if (!userId) throw new BadRequestException('User not found in request');
    return this.reviewService.deleteReview(reviewId, userId);
  }
}
