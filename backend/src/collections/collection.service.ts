import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
  async add(dto: CreateCollectionDto, userId: number): Promise<UserMusicCollection> {
    return this.prisma.userMusicCollection.create({
      data: {
        user: { connect: { id: userId } },
        music: { connect: { id: dto.musicId } },
        status: dto.status || Status.NONE,
      },
    });
  }

  // Update the status of a collection entry
  async update(
      id: number,
      dto: UpdateCollectionDto,
      userId: number,
    ): Promise<UserMusicCollection> {
      // Check if the user owns this entry before updating
      await this.getEntryAndCheckOwnership(id, userId);

      return this.prisma.userMusicCollection.update({
        where: { id },
        data: { status: dto.status },
      });
    }

  // Remove a music item from a user's collection
  async remove(
    id: number,
    userId: number,
  ): Promise<UserMusicCollection> {
    // Check if the user owns this entry before deleting
    await this.getEntryAndCheckOwnership(id, userId);

    return this.prisma.userMusicCollection.delete({ where: { id } });
  }

  // helper method to retrieve the entry and check ownership
  private async getEntryAndCheckOwnership(id: number, userId: number) {
    const entry = await this.prisma.userMusicCollection.findUnique({
      where: { id },
    });

    // Case 1: Entry not found
    if (!entry) {
      throw new NotFoundException(`Collection entry with ID ${id} not found`);
    }

    // Case 2: User is not the owner
    if (entry.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You do not own this collection entry',
      );
    }

    return entry;
  }

}
