import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Clear database. Order is important due to relations in the database
  await prisma.review.deleteMany();
  await prisma.userMusicCollection.deleteMany();
  await prisma.musicItem.deleteMany();
  await prisma.user.deleteMany();

  // Hash admin Password
  const adminPassword = await bcrypt.hash('12345678', 10);
  
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      role: 'ADMIN',
      password: adminPassword, // Hash #1
    },
  });

  
  // Hash user password Bcrypt will generate a new random salt, so the hash will be different.
  const userPassword = await bcrypt.hash('12345678', 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: 'user',
      role: 'USER',
      password: userPassword, // Hash #2 (Different String than Hash #1)
    },
  });

  // Musicitems
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
