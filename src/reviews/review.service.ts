import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // Get all reviews for a music item
  async getByMusic(musicId: number): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { musicId },
      include: { user: true },
    });

    return reviews;
  }

  // Add a new review for a music item
  async add(dto: CreateReviewDto): Promise<Review> {
    return this.prisma.review.create({
      data: {
        comment: dto.comment,
        rating: dto.rating,
        user: { connect: { id: dto.userId } },
        music: { connect: { id: dto.musicId } },
      },
    });
  }

  // Update an existing review (comment or rating)
  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data: {
        comment: dto.comment,
        rating: dto.rating,
      },
    });
  }

  // Delete a review by ID
  async remove(id: number): Promise<Review> {
    return this.prisma.review.delete({ where: { id } });
  }
}
