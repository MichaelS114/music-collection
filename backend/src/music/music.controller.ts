import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicItemDto, UpdateMusicItemDto } from '../dto/music.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Music Catalog') // Swagger group for music
@Controller('music') // Route: /music
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  // Get all music items
  @Get()
  @ApiOperation({ summary: 'Get all music items' })
  @ApiResponse({ status: 200, description: 'List of all music items' })
  findAll() {
    return this.musicService.findAll();
  }

  // Get a single music item by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single music item' })
  @ApiResponse({ status: 200, description: 'Music item found' })
  @ApiNotFoundResponse({ description: 'Music item not found' })
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  // Create a new music item (Admin only)
  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a music item (Admin only)' })
  @ApiResponse({ status: 201, description: 'Music item created' })
  @ApiBadRequestResponse({ description: 'Invalid creatorId or input data' })
  @ApiConflictResponse({ description: 'Music item already exists (unique constraint)' })
  @ApiForbiddenResponse({ description: 'Admin access only' })
  create(@Body() dto: CreateMusicItemDto) {
    return this.musicService.create(dto);
  }

  // Update an existing music item (Admin only)
  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a music item (Admin only)' })
  @ApiResponse({ status: 200, description: 'Music item updated' })
  @ApiNotFoundResponse({ description: 'Music item not found' })
  @ApiForbiddenResponse({ description: 'Admin access only' })
  update(@Param('id') id: string, @Body() dto: UpdateMusicItemDto) {
    return this.musicService.update(+id, dto);
  }

  // Delete a music item by ID (Admin only)
  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a music item (Admin only)' })
  @ApiResponse({ status: 200, description: 'Music item deleted' })
  @ApiNotFoundResponse({ description: 'Music item not found' })
  @ApiForbiddenResponse({ description: 'Admin access only' })
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
