import { Module } from '@nestjs/common';
import { MusicController } from './music/music.controller';
import { CollectionController } from './collections/collection.controller';
import { ReviewController } from './reviews/review.controller';

import { MusicService } from './music/music.service';
import { CollectionService } from './collections/collection.service';
import { ReviewService } from './reviews/review.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    MusicController,
    CollectionController,
    ReviewController,
  ],
  providers: [
    MusicService,
    CollectionService,
    ReviewService,
    PrismaService,
  ],
})
export class AppModule {}
