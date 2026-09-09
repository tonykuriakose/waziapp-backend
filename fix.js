const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.update({ where: { email: 't4tonykuriakose@gmail.com' }, data: { isActive: true } })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
