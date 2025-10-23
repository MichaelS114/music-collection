import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
  async findOne(id: number): Promise<MusicItem> {
    const item = await this.prisma.musicItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Music item with ID ${id} not found`);
    }
    return item;
  }

  // Update an existing music item
  async update(id: number, data: Partial<CreateMusicItemDto>): Promise<MusicItem> {
    try {
      return await this.prisma.musicItem.update({
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Record not found
        throw new NotFoundException(`Music item with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Delete a music item by ID
  async remove(id: number): Promise<MusicItem> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.review.deleteMany({ where: { musicId: id } });
        await tx.userMusicCollection.deleteMany({ where: { musicId: id } });
        return tx.musicItem.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Record not found
        throw new NotFoundException(`Music item with ID ${id} not found`);
      }
      else if (error.code === 'P2003') {
          throw new ConflictException(`Cannot delete music item ${id}: related records exist`);
        }
      throw error;
    }
  }

  // Create a new music item and link it to a user
  async create(data: CreateMusicItemDto): Promise<MusicItem> {
    try {
      return await this.prisma.musicItem.create({
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Unique constraint failed
        throw new ConflictException(
          `Music item with title "${data.title}" by "${data.artist}" already exists`,
        );
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        // Foreign key constraint failed
        throw new BadRequestException(`Invalid creatorId: ${data.creatorId}`);
      }
      throw error;
    }
  }
}
