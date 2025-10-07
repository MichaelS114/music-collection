import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from '../dto/collection.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Collections') // Swagger group for collection
@Controller('collections') // Route: /collections
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get collection of a specific user' })
  getUserCollection(@Param('userId') userId: string) {
    return this.collectionService.getByUser(+userId); // Get all collection entries for a user
  }

  @Post()
  @ApiOperation({ summary: 'Add music item to user collection' })
  add(@Body() dto: CreateCollectionDto) {
    return this.collectionService.add(dto); // Add new music item to users collection
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection entry (e.g. change status)' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(+id, dto); // Update collection entry details
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove music item from collection' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id); // Remove item from users collection
  }
}
