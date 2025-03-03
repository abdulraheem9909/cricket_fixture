
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingSuperadmin = await prisma.user.findUnique({
    where: { username: 'superadmin' },
  });

  if (!existingSuperadmin) {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    await prisma.user.create({
      data: {
        username: 'superadmin',
        password: hashedPassword,
      },
    });
    console.log('Superadmin created!');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
