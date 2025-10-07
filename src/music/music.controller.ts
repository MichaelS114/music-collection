import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicItemDto, UpdateMusicItemDto } from '../dto/music.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Music Catalog') // Swagger group for music
@Controller('music') // Route: /music
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @ApiOperation({ summary: 'Get all music items' })
  @ApiResponse({ status: 200, description: 'List of all music items' })
  findAll() {
    return this.musicService.findAll(); // Return all music items
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single music item' })
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id); // Return one music item by ID
  }

  @Post()
  @ApiOperation({ summary: 'Create a music item (Admin only)' })
  create(@Body() dto: CreateMusicItemDto) {
    return this.musicService.create(dto); // Create new music item
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a music item (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateMusicItemDto) {
    return this.musicService.update(+id, dto); // Update existing music item
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a music item (Admin only)' })
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id); // Delete music item by ID
  }
}
