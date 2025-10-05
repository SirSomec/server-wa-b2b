import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import {
  AuditEvent,
  ConversationStatus,
  MessageDirection,
  MessagePayloadType,
  MessageSource,
  WebhookEventStatus,
} from '@prisma/client';

import { PrismaService } from '../database/prisma.service';

interface ProcessContext {
  eventId: string;
  tenantId: string;
  jivoChannelId: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class JivoEventProcessorService {
  private readonly logger = new Logger(JivoEventProcessorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async process(context: ProcessContext): Promise<void> {
    try {
      const { conversationId, occurredAt } = await this.ensureConversation(context);
      await this.persistMessage(context, conversationId, occurredAt);

      await this.prisma.jivoWebhookEvent.update({
        where: { id: context.eventId },
        data: {
          status: WebhookEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        { eventId: context.eventId, error },
        'Failed to process Jivo webhook payload',
      );
      await this.prisma.jivoWebhookEvent.update({
        where: { id: context.eventId },
        data: {
          status: WebhookEventStatus.FAILED,
          error: message,
          processedAt: new Date(),
        },
      });
    }
  }

  private async ensureConversation({
    tenantId,
    jivoChannelId,
    payload,
  }: ProcessContext): Promise<{ conversationId: string; occurredAt: Date }> {
    const sender = this.asRecord(payload['sender']);
    const recipient = this.asRecord(payload['recipient']);
    const message = this.asRecord(payload['message']);

    const externalUserId = this.detectExternalUserId(sender, recipient, payload);
    if (!externalUserId) {
      throw new Error('Cannot determine external user id from payload');
    }

    const occurredAt = this.resolveDate(message);

    let conversation = await this.prisma.conversation.findFirst({
      where: {
        tenantId,
        jivoChannelId,
        externalUserId,
      },
    });

    if (!conversation) {
      const conversationData = {
        tenantId,
        jivoChannelId,
        whatsappAccountId: undefined as unknown as string,
        externalUserId,
        status: ConversationStatus.OPEN,
        lastMessageAt: occurredAt,
      };

      conversation = await this.prisma.conversation.create({
        data: conversationData as Prisma.ConversationUncheckedCreateInput,
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: occurredAt,
          status: ConversationStatus.OPEN,
        },
      });
    }

    return { conversationId: conversation.id, occurredAt };
  }

  private async persistMessage(
    { eventId, tenantId, payload }: ProcessContext,
    conversationId: string,
    occurredAt: Date,
  ): Promise<void> {
    const sender = this.asRecord(payload['sender']);
    const message = this.asRecord(payload['message']);

    const direction = this.resolveDirection(sender);
    const payloadType = this.resolvePayloadType(message['type']);

    const text = typeof message['text'] === 'string' ? message['text'] : null;
    const correlationId = this.extractCorrelationId(message['id']);

    const createdMessage = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        direction,
        source: MessageSource.JIVO,
        payloadType,
        text,
        payload: payload as Prisma.JsonObject,
        correlationId,
        sentAt: occurredAt,
        deliveredAt: direction === MessageDirection.INBOUND ? occurredAt : null,
      },
    });

    await this.persistMediaIfPresent(createdMessage.id, message, occurredAt);

    const auditMetadata: Prisma.JsonObject = {
      eventId,
      direction,
      payloadType,
    };

    await this.prisma.messageAuditLog.create({
      data: {
        messageId: createdMessage.id,
        tenantId,
        direction,
        event:
          direction === MessageDirection.INBOUND ? AuditEvent.RECEIVED : AuditEvent.TRANSFORMED,
        metadata: auditMetadata,
      },
    });
  }

  private async persistMediaIfPresent(
    messageId: string,
    message: Record<string, unknown>,
    occurredAt: Date,
  ) {
    const fileUrl = this.asString(message['file']);
    if (!fileUrl) {
      return;
    }

    const mime = this.asString(message['mime_type']) ?? 'application/octet-stream';
    const size = this.asNumber(message['file_size']) ?? 0;

    await this.prisma.messageMedia.create({
      data: {
        messageId,
        storageKey: fileUrl,
        originalUrl: fileUrl,
        mimeType: mime,
        sizeBytes: size,
        expiresAt: new Date(occurredAt.getTime() + 24 * 60 * 60 * 1000),
      },
    });
  }

  private detectExternalUserId(
    sender: Record<string, unknown>,
    recipient: Record<string, unknown>,
    payload: Record<string, unknown>,
  ): string | null {
    const senderId = this.asString(sender['id']);
    const recipientId = this.asString(recipient['id']);
    const visitor = this.asRecord(payload['visitor']);
    const visitorId = this.asString(visitor['id']);

    return senderId ?? recipientId ?? visitorId;
  }

  private resolveDirection(sender: Record<string, unknown>): MessageDirection {
    const senderType = this.asString(sender['type'])?.toLowerCase();
    if (senderType === 'client' || senderType === 'visitor') {
      return MessageDirection.INBOUND;
    }
    if (senderType === 'agent' || senderType === 'operator') {
      return MessageDirection.OUTBOUND;
    }
    return MessageDirection.INBOUND;
  }

  private resolvePayloadType(typeValue: unknown): MessagePayloadType {
    const rawType = this.asString(typeValue)?.toUpperCase();
    const allowed = Object.values(MessagePayloadType) as string[];
    if (rawType && allowed.includes(rawType)) {
      return rawType as MessagePayloadType;
    }
    return MessagePayloadType.TEXT;
  }

  private resolveDate(message: Record<string, unknown>): Date {
    const timestamp = this.asNumber(message['date']);
    if (timestamp) {
      if (timestamp > 1_000_000_000_000) {
        return new Date(timestamp);
      }
      return new Date(timestamp * 1000);
    }
    return new Date();
  }

  private extractCorrelationId(value: unknown): string | undefined {
    const id = this.asString(value);
    if (!id) {
      return undefined;
    }
    return id.length === 36 ? id : undefined;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  private asString(value: unknown): string | null {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return null;
  }

  private asNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }
}
