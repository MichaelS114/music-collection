import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// DTO for creating a new review on a music item
export class CreateReviewDto {
  @ApiProperty({ example: 1 }) // ID of the user
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 }) // ID of the music item
  @IsInt()
  musicId: number;

  @ApiProperty({ example: 'Amazing track, love the lyrics!' }) // Review text
  @IsString()
  comment: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 }) // Optional 1–5 star rating
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;
}

// DTO for updating an existing review (all fields optional)
export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
