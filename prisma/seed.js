const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL ;
  const plain = process.env.SEED_USER_PASSWORD ;

  const hashed = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Test User',
      password: hashed,
      role: 'usuario',
      category: null,
    },
    create: {
      name: 'Test User',
      email,
      password: hashed,
      role: 'usuario',
      category: null,
    },
  });

  console.log('Seeded user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
