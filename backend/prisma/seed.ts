import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function upsertRole(code: string, name: string, scopes: string[], tenantId: string | null) {
  if (tenantId === null) {
    const existing = await prisma.role.findFirst({
      where: {
        tenantId: null,
        code,
      },
    });

    if (existing) {
      return prisma.role.update({
        where: { id: existing.id },
        data: {
          name,
          scopes,
        },
      });
    }

    return prisma.role.create({
      data: {
        tenantId: null,
        code,
        name,
        scopes,
      },
    });
  }

  return prisma.role.upsert({
    where: {
      tenantId_code: {
        tenantId,
        code,
      },
    },
    update: {
      name,
      scopes,
    },
    create: {
      tenantId,
      code,
      name,
      scopes,
    },
  });
}

async function assignRole(userId: string, roleId: string) {
  const existing = await prisma.userRoleAssignment.findFirst({
    where: { userId, roleId },
  });

  if (!existing) {
    await prisma.userRoleAssignment.create({
      data: { userId, roleId },
    });
  }
}

async function upsertPlatformUser(email: string, passwordHash: string, displayName: string) {
  const existing = await prisma.user.findFirst({
    where: {
      tenantId: null,
      email,
    },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        displayName,
        isPlatformAdmin: true,
      },
    });
  }

  return prisma.user.create({
    data: {
      tenantId: null,
      email,
      displayName,
      passwordHash,
      isPlatformAdmin: true,
    },
  });
}
async function main() {
  const platformAdminRole = await upsertRole(
    'platform-admin',
    'Platform Administrator',
    ['platform:*'],
    null,
  );

  await upsertRole('tenant-admin-template', 'Tenant Admin Template', ['tenant:*'], null);
  await upsertRole(
    'tenant-operator-template',
    'Tenant Operator Template',
    ['tenant:messages:read'],
    null,
  );

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const adminUser = await upsertPlatformUser(adminEmail, passwordHash, 'Platform Admin');

  await assignRole(adminUser.id, platformAdminRole.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
