import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from '../dto/collection.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Collections') // Swagger group for collection
@Controller('collections') // Route: /collections
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // Get all collection entries for a specific user
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get collection of a specific user' })
  @ApiResponse({ status: 200, description: 'List of collection entries (empty array if none found)' })
  getUserCollection(@Param('userId') userId: string) {
    return this.collectionService.getByUser(+userId); 
  }

  // Add music item to user collection
  @Post()
  @ApiOperation({ summary: 'Add music item to user collection' })
  @ApiResponse({ status: 201, description: 'Collection entry created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  add(@Body() dto: CreateCollectionDto) {
    return this.collectionService.add(dto); 
  }

  // Update collection entry
  @Patch(':id')
  @ApiOperation({ summary: 'Update collection entry (LIKE, DISLIKE, FAVOURITE, NONE)' })
  @ApiResponse({ status: 200, description: 'Collection entry successfully updated' })
  @ApiNotFoundResponse({ description: 'Collection entry not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(+id, dto); 
  }

  // Remove music item from user collection
  @Delete(':id')
  @ApiOperation({ summary: 'Remove music item from collection' })
  @ApiResponse({ status: 200, description: 'Collection entry successfully removed' })
  @ApiNotFoundResponse({ description: 'Collection entry not found' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id);
  }
}
