import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  musicId: number;

  @ApiProperty({ example: 'Amazing track, love the lyrics!' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
