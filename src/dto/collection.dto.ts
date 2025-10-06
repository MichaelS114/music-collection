import { IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum Status {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  FAVOURITE = 'FAVOURITE',
  NONE = 'NONE',
}

export class CreateCollectionDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  musicId: number;

  @ApiProperty({ enum: Status, default: Status.NONE })
  @IsEnum(Status)
  status: Status;
}

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {}
