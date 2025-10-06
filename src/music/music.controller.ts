import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicItemDto, UpdateMusicItemDto } from '../dto/music.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Music Catalog')   // shows in Swagger
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @ApiOperation({ summary: 'Get all music items' })
  @ApiResponse({ status: 200, description: 'List of all music items' })
  findAll() {
    return this.musicService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single music item' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a music item (Admin only)' })
  create(@Body() dto: CreateMusicItemDto) {
    return this.musicService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a music item (Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateMusicItemDto) {
    return this.musicService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a music item (Admin only)' })
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
