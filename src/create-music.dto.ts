import { ApiProperty } from '@nestjs/swagger';
import { MusicType } from '@prisma/client';

export class CreateMusicDto {
  @ApiProperty({ example: 'Blank Space' })
  title: string;

  @ApiProperty({ example: 'Taylor Swift' })
  artist: string;

  @ApiProperty({ example: '1989', required: false })
  album?: string;

  @ApiProperty({ example: 2014, required: false })
  year?: number;

  @ApiProperty({ example: 'Pop', required: false })
  genre?: string;

  @ApiProperty({ enum: MusicType, example: MusicType.TRACK })
  type: MusicType;

  @ApiProperty({ example: 1 })
  createdBy: number;
}
