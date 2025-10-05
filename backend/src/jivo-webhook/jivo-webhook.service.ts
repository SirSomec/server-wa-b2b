/* eslint-disable import/order */
import { randomUUID } from 'crypto';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { WebhookEventStatus } from '@prisma/client';

import { QueueEnvelope } from '@server-wa-b2b/contracts';
import { PrismaService } from '../database/prisma.service';
import { QueueService } from '../queue/queue.service';
import { JivoEventProcessorService } from './jivo-event-processor.service';

@Injectable()
export class JivoWebhookService {
  private readonly logger = new Logger(JivoWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
    private readonly processor: JivoEventProcessorService,
  ) {}

  async handleWebhook(
    secret: string | undefined,
    payload: unknown,
    headers: Record<string, string | string[]>,
  ): Promise<void> {
    if (!secret) {
      throw new UnauthorizedException('Missing Jivo webhook secret');
    }

    const channel = await this.prisma.jivoChannel.findFirst({
      where: { inboundSecret: secret },
      select: { id: true, tenantId: true },
    });

    if (!channel) {
      throw new UnauthorizedException('Unknown Jivo webhook secret');
    }

    const normalizedHeaders = this.normalizeHeaders(headers);
    const rawPayload = (payload ?? {}) as Record<string, unknown>;

    const event = await this.prisma.jivoWebhookEvent.create({
      data: {
        tenantId: channel.tenantId,
        jivoChannelId: channel.id,
        status: WebhookEventStatus.PENDING,
        payload: rawPayload as Prisma.JsonObject,
        headers: normalizedHeaders as Prisma.JsonObject,
      },
    });

    await this.processor.process({
      eventId: event.id,
      tenantId: channel.tenantId,
      jivoChannelId: channel.id,
      payload: rawPayload,
    });

    const envelope: QueueEnvelope = {
      id: randomUUID(),
      type: 'jivo-webhook',
      createdAt: new Date().toISOString(),
      payload: {
        eventId: event.id,
        tenantId: channel.tenantId,
        jivoChannelId: channel.id,
        raw: rawPayload,
        headers: normalizedHeaders,
      },
    };

    await this.queue.publish(envelope);
    this.logger.debug({ channelId: channel.id }, 'Enqueued Jivo webhook payload');
  }

  private normalizeHeaders(headers: Record<string, string | string[]>): Record<string, string> {
    return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key.toLowerCase()] = value.join(',');
      } else if (value !== undefined) {
        acc[key.toLowerCase()] = value;
      }
      return acc;
    }, {});
  }
}
