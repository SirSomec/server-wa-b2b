'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const bcrypt = __importStar(require('bcrypt'));
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 12;
async function upsertRole(code, name, scopes, tenantId) {
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
async function assignRole(userId, roleId) {
  const existing = await prisma.userRoleAssignment.findFirst({
    where: { userId, roleId },
  });
  if (!existing) {
    await prisma.userRoleAssignment.create({
      data: { userId, roleId },
    });
  }
}
async function upsertPlatformUser(email, passwordHash, displayName) {
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
