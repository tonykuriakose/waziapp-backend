import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixPermissions() {
  const users = await prisma.user.findMany({ where: { permissions: { isEmpty: true } } });
  
  for (const user of users) {
    const roleDef = await prisma.rolePermission.findUnique({ where: { role: user.role } });
    if (roleDef) {
      await prisma.user.update({
        where: { id: user.id },
        data: { permissions: roleDef.permissions }
      });
      console.log(`Fixed permissions for ${user.email} (${user.role})`);
    }
  }
}

fixPermissions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
