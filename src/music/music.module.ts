import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

// Module for bundeling all controllers and services
@Module({
  providers: [MusicService], // Business logic for music items
  controllers: [MusicController], // Handles HTTP routes for music items
})
export class MusicModule {}
