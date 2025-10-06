import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserMusicCollection } from '@prisma/client';
import { UpdateCollectionDto, CreateCollectionDto, Status  } from '../dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<UserMusicCollection[]> {
    return this.prisma.userMusicCollection.findMany({
      include: { music: true, user: true },
    });
  }

  async getByUser(userId: number): Promise<UserMusicCollection[]> {
    return this.prisma.userMusicCollection.findMany({
      where: { userId },
      include: { music: true },
    });
  }

  async add(dto: CreateCollectionDto): Promise<UserMusicCollection> {
    return this.prisma.userMusicCollection.create({
      data: {
        user: { connect: { id: dto.userId } },
        music: { connect: { id: dto.musicId } },
        status: dto.status || Status.NONE,
      },
    });
  }

  async update(id: number, dto: UpdateCollectionDto): Promise<UserMusicCollection> {
    return this.prisma.userMusicCollection.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: number): Promise<UserMusicCollection> {
    return this.prisma.userMusicCollection.delete({ where: { id } });
  }
}
