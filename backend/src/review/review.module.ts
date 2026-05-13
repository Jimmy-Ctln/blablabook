import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BooksModule } from '@/books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
