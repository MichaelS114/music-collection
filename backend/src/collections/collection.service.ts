import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserMusicCollection } from '@prisma/client';
import { UpdateCollectionDto, CreateCollectionDto, Status } from '../dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  // Get all user music collection entries
  async getAll(): Promise<UserMusicCollection[]> {
    return this.prisma.userMusicCollection.findMany({
      include: { music: true, user: true },
    });
  }

  // Get all collection entries for a specific user
  async getByUser(userId: number): Promise<UserMusicCollection[]> {
    return this.prisma.userMusicCollection.findMany({
      where: { userId },
      include: { music: true },
    });
  }

  // Add a new music item to a user's collection
  async add(dto: CreateCollectionDto): Promise<UserMusicCollection> {
    return this.prisma.userMusicCollection.create({
      data: {
        user: { connect: { id: dto.userId } },
        music: { connect: { id: dto.musicId } },
        status: dto.status || Status.NONE,
      },
    });
  }

  // Update the status of a collection entry
  async update(id: number, dto: UpdateCollectionDto): Promise<UserMusicCollection> {
    try {
      return await this.prisma.userMusicCollection.update({
        where: { id },
        data: { status: dto.status },
      });
    } catch (error) {
      // Prisma error P2025 = record not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`Collection entry with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Remove a music item from a user's collection
  async remove(id: number): Promise<UserMusicCollection> {
    try {
      return await this.prisma.userMusicCollection.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Collection entry with ID ${id} not found`);
      }
      throw error;
    }
  }
}
