import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('music/:musicId')
  @ApiOperation({ summary: 'Get all reviews for a music item' })
  getByMusic(@Param('musicId') musicId: string) {
    return this.reviewService.getByMusic(+musicId);
  }

  @Post()
  @ApiOperation({ summary: 'Add review for a music item' })
  add(@Body() dto: CreateReviewDto) {
    return this.reviewService.add(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
