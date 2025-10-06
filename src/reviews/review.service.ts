import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getByMusic(musicId: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { musicId },
      include: { user: true },
    });
  }

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

  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
  return this.prisma.review.update({
    where: { id },
    data: {
      comment: dto.comment,
      rating: dto.rating,
    },
  });
}


  async remove(id: number): Promise<Review> {
    return this.prisma.review.delete({ where: { id } });
  }
}
