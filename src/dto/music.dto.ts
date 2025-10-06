import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum MusicType {
  TRACK = 'TRACK',
  ALBUM = 'ALBUM',
}

export class CreateMusicItemDto {
  @ApiProperty({ example: 'Love Story' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Taylor Swift' })
  @IsString()
  artist: string;

  @ApiProperty({ required: false, example: 'Fearless (Taylor\'s Version)' })
  @IsOptional()
  @IsString()
  album?: string;

  @ApiProperty({ required: false, example: 2021 })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty({ required: false, example: 'Pop' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ enum: MusicType, example: MusicType.TRACK })
  @IsEnum(MusicType)
  type: MusicType;

  @ApiProperty({ example: 1 })
  @IsInt()
  creatorId: number;
}

export class UpdateMusicItemDto extends PartialType(CreateMusicItemDto) {}
