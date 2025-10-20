import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Enum to choose between tracks and album
export enum MusicType {
  TRACK = 'TRACK',
  ALBUM = 'ALBUM',
}

// DTO for creating a new music item
export class CreateMusicItemDto {
  @ApiProperty({ example: 'Love Story' }) // Song or album title
  @IsString()
  title: string;

  @ApiProperty({ example: 'Taylor Swift' }) // Artist name
  @IsString()
  artist: string;

  @ApiProperty({ required: false, example: "Fearless (Taylor's Version)" }) // Optional album name
  @IsOptional()
  @IsString()
  album?: string;

  @ApiProperty({ required: false, example: 2021 }) // Optional release year
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty({ required: false, example: 'Pop' }) // Optional genre
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ enum: MusicType, example: MusicType.TRACK }) // Type of music item
  @IsEnum(MusicType)
  type: MusicType;

  @ApiProperty({ example: 1 }) // ID of the creator (user/admin)
  @IsInt()
  creatorId: number;
}

// DTO for updating a music item (all fields optional)
export class UpdateMusicItemDto extends PartialType(CreateMusicItemDto) {}
