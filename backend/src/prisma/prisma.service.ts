import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Connect to the database on module start
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect to the database on module destroy
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
