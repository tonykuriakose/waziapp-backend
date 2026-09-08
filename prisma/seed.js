import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('Seeding database...');
    // 1. Create a default tenant
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Default Tenant',
        },
    });
    console.log(`Created Tenant: ${tenant.name} (${tenant.id})`);
    // 2. Setup Super Admin permissions
    const allPermissions = [
        'projects.read', 'projects.create', 'projects.update', 'projects.delete',
        'users.read', 'users.create', 'users.update', 'users.disable',
        'permissions.manage'
    ];
    // 3. Create Super Admin User
    const passwordHash = await bcrypt.hash('admin@123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 't4tonykuriakose@gmail.com' },
        update: {},
        create: {
            email: 't4tonykuriakose@gmail.com',
            passwordHash,
            role: 'SUPER_ADMIN',
            tenantId: tenant.id,
            permissions: allPermissions,
            isActive: true,
        },
    });
    console.log(`Created Super Admin: ${superAdmin.email}`);
    console.log(`Password: admin123`);
    // 4. Create default Role permissions for standard Admins
    await prisma.rolePermission.upsert({
        where: { role: 'ADMIN' },
        update: {},
        create: {
            role: 'ADMIN',
            permissions: [
                'projects.read', 'projects.create', 'projects.update', 'projects.delete',
                'users.read', 'users.create', 'users.update', 'users.disable'
            ]
        }
    });
    console.log(`Created default ADMIN role permissions.`);
    console.log('Seeding finished successfully!');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map