import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Datenbank bereinigen (Reihenfolge wegen Foreign Keys wichtig!)
  await prisma.review.deleteMany();
  await prisma.userMusicCollection.deleteMany();
  await prisma.musicItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Dummy-Daten anlegen

  // Admin
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      role: 'ADMIN',
    },
  });

  // Normaler User
  const user = await prisma.user.create({
    data: {
      username: 'user',
      role: 'USER',
    },
  });

  // Musikitems
  const song1 = await prisma.musicItem.create({
    data: {
      title: 'Love Story',
      artist: 'Taylor Swift',
      album: 'Fearless (Taylor\'s Version)',
      year: 2021,
      genre: 'Pop',
      type: 'TRACK',
      creator: { connect: { id: admin.id } },
    },
  });

  const song2 = await prisma.musicItem.create({
    data: {
      title: 'Cardigan',
      artist: 'Taylor Swift',
      album: 'Folklore',
      year: 2020,
      genre: 'Indie Pop',
      type: 'TRACK',
      creator: { connect: { id: admin.id } },
    },
  });

  // User Collection
  await prisma.userMusicCollection.create({
    data: {
      user: { connect: { id: user.id } },
      music: { connect: { id: song1.id } },
      status: 'FAVOURITE',
    },
  });

  await prisma.userMusicCollection.create({
    data: {
      user: { connect: { id: user.id } },
      music: { connect: { id: song2.id } },
      status: 'LIKE',
    },
  });

  // Review
  await prisma.review.create({
    data: {
      comment: 'Amazing track, love it!',
      rating: 5,
      user: { connect: { id: user.id } },
      music: { connect: { id: song1.id } },
    },
  });
}

main()
  .then(() => {
    console.log('Database seeded with test data');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
