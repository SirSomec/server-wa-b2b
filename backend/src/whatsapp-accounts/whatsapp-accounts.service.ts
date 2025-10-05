import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateWhatsappAccountDto } from './dto/create-whatsapp-account.dto';
import { UpdateWhatsappAccountDto } from './dto/update-whatsapp-account.dto';

@Injectable()
export class WhatsappAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWhatsappAccountDto & { tenantId: string }) {
    const account = await this.prisma.whatsappAccount.create({
      data: {
        alias: dto.alias,
        phoneNumber: dto.phoneNumber,
        status: dto.status,
        sessionMode: dto.sessionMode,
        tenantId: dto.tenantId,
      },
    });

    return account;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.whatsappAccount.findMany({ where: { tenantId } });
  }

  async findOne(id: string, tenantId: string) {
    const account = await this.prisma.whatsappAccount.findFirst({ where: { id, tenantId } });

    if (!account) {
      throw new NotFoundException('WhatsApp account not found');
    }

    return account;
  }

  async update(id: string, tenantId: string, dto: UpdateWhatsappAccountDto) {
    await this.findOne(id, tenantId);
    return this.prisma.whatsappAccount.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.waSession.deleteMany({ where: { whatsappAccountId: id } });
    return this.prisma.whatsappAccount.delete({ where: { id } });
  }
}
