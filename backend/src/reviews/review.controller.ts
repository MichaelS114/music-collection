import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Reviews') // Swagger group for review
@Controller('reviews') // Route: /reviews
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Get all reviews for a music item
  @Get('music/:musicId')
  @ApiOperation({ summary: 'Get all reviews for a music item' })
  @ApiResponse({ status: 200, description: 'List of reviews (empty array if none found)' })
  getByMusic(@Param('musicId') musicId: string) {
    return this.reviewService.getByMusic(+musicId); // Get all reviews linked to a music item
  }

  // Add review for a music item
  @Post()
  @ApiOperation({ summary: 'Add review for a music item' })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid input data (e.g. missing fields)' })
  add(@Body() dto: CreateReviewDto) {
    return this.reviewService.add(dto); // Create a new review
  }

  // Update review
  @Patch(':id')
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review successfully updated' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(+id, dto); // Edit an existing review
  }

  // Delete review
  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review successfully deleted' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id); // Delete a review by ID
  }
}
