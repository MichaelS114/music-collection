import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from '../dto/collection.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get collection of a specific user' })
  getUserCollection(@Param('userId') userId: string) {
    return this.collectionService.getByUser(+userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add music item to user collection' })
  add(@Body() dto: CreateCollectionDto) {
    return this.collectionService.add(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection entry (e.g. change status)' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove music item from collection' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id);
  }
}
