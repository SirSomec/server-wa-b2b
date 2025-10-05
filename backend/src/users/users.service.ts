import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '../auth/dto/login.dto';
import { PrismaService } from '../database/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 12;

type UserWithRoles = User & {
  assignments: { role: { code: string } }[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
        tenantId: dto.tenantId ?? null,
        isPlatformAdmin: dto.isPlatformAdmin ?? false,
      },
    });

    if (dto.roles?.length) {
      await this.assignRoles(user.id, dto.roles, dto.tenantId ?? null);
    }

    return this.findById(user.id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: Record<string, unknown> = {};

    if (dto.displayName) {
      data.displayName = dto.displayName;
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    if (dto.isPlatformAdmin !== undefined) {
      data.isPlatformAdmin = dto.isPlatformAdmin;
    }

    await this.prisma.user.update({ where: { id }, data });

    if (dto.roles) {
      await this.prisma.userRoleAssignment.deleteMany({ where: { userId: id } });
      const user = await this.prisma.user.findUnique({ where: { id } });
      await this.assignRoles(id, dto.roles, user?.tenantId ?? null);
    }

    return this.findById(id);
  }

  async findAllByTenant(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      include: {
        assignments: {
          include: { role: true },
        },
      },
    });

    return users.map((user) => this.mapUser(user as UserWithRoles));
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        assignments: { include: { role: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapUser(user as UserWithRoles);
  }

  private async assignRoles(userId: string, roleCodes: string[], tenantId: string | null) {
    if (!roleCodes.length) {
      return;
    }

    const roles = await this.prisma.role.findMany({
      where: tenantId
        ? { code: { in: roleCodes }, tenantId }
        : { code: { in: roleCodes }, tenantId: null },
    });

    if (!roles.length) {
      return;
    }

    await this.prisma.userRoleAssignment.createMany({
      data: roles.map((role) => ({ userId, roleId: role.id })),
    });
  }

  async validateCredentials(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
        tenantId: loginDto.tenantId ?? null,
      },
      include: {
        assignments: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return this.mapUser(user as UserWithRoles);
  }

  private mapUser(user: UserWithRoles) {
    const roles = user.assignments.map((assignment) => assignment.role.code);

    if (user.isPlatformAdmin && !roles.includes('platform-admin')) {
      roles.push('platform-admin');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      tenantId: user.tenantId ?? undefined,
      isPlatformAdmin: user.isPlatformAdmin,
      roles,
    };
  }
}
