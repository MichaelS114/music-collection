import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MusicItem, Prisma } from '@prisma/client';
import { CreateMusicItemDto } from '../dto/music.dto';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) {}

  // Get all music items
  async findAll(): Promise<MusicItem[]> {
    return this.prisma.musicItem.findMany();
  }

  // Get a single music item by ID
  async findOne(id: number): Promise<MusicItem | null> {
    return this.prisma.musicItem.findUnique({ where: { id } });
  }

  // Update an existing music item
  async update(id: number, data: Partial<CreateMusicItemDto>): Promise<MusicItem> {
    return this.prisma.musicItem.update({
      where: { id },
      data: {
        title: data.title,
        artist: data.artist,
        album: data.album,
        year: data.year,
        genre: data.genre,
        type: data.type,
      },
    });
  }

  // Delete a music item by ID
  async remove(id: number): Promise<MusicItem> {
    return this.prisma.musicItem.delete({ where: { id } });
  }

  // Create a new music item and link it to a user
  async create(data: CreateMusicItemDto): Promise<MusicItem> {
    return this.prisma.musicItem.create({
      data: {
        title: data.title,
        artist: data.artist,
        album: data.album,
        year: data.year,
        genre: data.genre,
        type: data.type,
        creator: { connect: { id: data.creatorId } },
      },
    });
  }
}
