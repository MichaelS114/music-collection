import { IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// Enum for possible collection item statuses
export enum Status {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  FAVOURITE = 'FAVOURITE',
  NONE = 'NONE',
}

// DTO for adding a new item to a users collection
export class CreateCollectionDto {
  @ApiProperty({ example: 2 }) // Example user ID for swagger
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 }) // Example music ID for swagger
  @IsInt()
  musicId: number;

  @ApiProperty({ enum: Status, default: Status.NONE }) // Status of the item
  @IsEnum(Status)
  status: Status;
}

// DTO for updating an existing collection entry
export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {}
