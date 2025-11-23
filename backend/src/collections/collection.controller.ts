import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto, UpdateCollectionDto } from '../dto/collection.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Collections') // Swagger group for collection
@ApiBearerAuth() 
@UseGuards(AuthGuard('jwt'))
@Controller('collections') // Route: /collections
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // Get all collection entries for a specific user (admin only)
  @Get('user/:userId')
  @UseGuards(RolesGuard) 
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get collection of a specific user (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of collection entries' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized (token missing or invalid)' })
  @ApiForbiddenResponse({ description: 'Admin access only' })
  getUserCollection(@Param('userId') userId: string) {
    return this.collectionService.getByUser(+userId);
  }

  // Add music item to user collection
  @Post()
  @ApiOperation({ summary: 'Add music item to your collection' })
  @ApiResponse({ status: 201, description: 'Collection entry created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized (token missing or invalid)' })
  add(@Body() dto: CreateCollectionDto, @Request() req) {
    return this.collectionService.add(dto, req.user.id);
  }

  // Update collection entry
  @Patch(':id')
  @ApiOperation({ summary: 'Update your collection entry (LIKE, DISLIKE, etc.)' })
  @ApiResponse({ status: 200, description: 'Collection entry updated' })
  @ApiNotFoundResponse({ description: 'Collection entry not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized (token missing or invalid)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
    @Request() req,
  ) {
    return this.collectionService.update(+id, dto, req.user.id);
  }

  // Remove music item from user collection
  @Delete(':id')
  @ApiOperation({ summary: 'Remove music item from your collection' })
  @ApiResponse({ status: 200, description: 'Collection entry removed' })
  @ApiNotFoundResponse({ description: 'Collection entry not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized (token missing or invalid)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.collectionService.remove(+id, req.user.id);
  }
}
