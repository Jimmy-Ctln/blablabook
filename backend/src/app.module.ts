import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { DrizzleModule } from './db/drizzle.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 60, // Default: 60 requests per 60s
      },
    ]),
    DrizzleModule.forRoot({
      // Inject the connection string from environment variables.
      // The DrizzleModule will handle validation during the application bootstrap.
      connectionString: process.env.DATABASE_URL as string,
    }),
    AuthModule,
    BooksModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
