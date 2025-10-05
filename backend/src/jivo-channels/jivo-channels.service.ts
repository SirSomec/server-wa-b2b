import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateJivoChannelDto } from './dto/create-jivo-channel.dto';
import { UpdateJivoChannelDto } from './dto/update-jivo-channel.dto';

@Injectable()
export class JivoChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJivoChannelDto) {
    const channel = await this.prisma.jivoChannel.create({
      data: {
        name: dto.name,
        outboundUrl: dto.outboundUrl,
        inboundSecret: dto.inboundSecret,
        tenantId: dto.tenantId ?? null,
        status: dto.status,
      },
    });

    return channel;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.jivoChannel.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    const channel = await this.prisma.jivoChannel.findFirst({
      where: { id, tenantId },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async update(id: string, tenantId: string, dto: UpdateJivoChannelDto) {
    await this.findOne(id, tenantId);
    return this.prisma.jivoChannel.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.channelCredential.deleteMany({ where: { channelId: id } });
    return this.prisma.jivoChannel.delete({ where: { id } });
  }
}
