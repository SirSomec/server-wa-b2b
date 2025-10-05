import {
  AuditEvent,
  MessageDirection,
  MessagePayloadType,
  WebhookEventStatus,
} from '@prisma/client';

import { JivoEventProcessorService } from '../../src/jivo-webhook/jivo-event-processor.service';
import { JivoWebhookService } from '../../src/jivo-webhook/jivo-webhook.service';

describe('JivoWebhookService', () => {
  const prisma: any = {
    jivoChannel: {
      findFirst: jest.fn(),
    },
    jivoWebhookEvent: {
      create: jest.fn(),
      update: jest.fn(),
    },
    conversation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    message: {
      create: jest.fn(),
    },
    messageMedia: {
      create: jest.fn(),
    },
    messageAuditLog: {
      create: jest.fn(),
    },
  };

  const queue: any = {
    publish: jest.fn(),
  };

  const buildService = () => {
    const processor = new JivoEventProcessorService(prisma);
    return new JivoWebhookService(prisma, queue, processor);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('stores event, processes message and publishes to queue', async () => {
    prisma.jivoChannel.findFirst.mockResolvedValue({ id: 'channel-1', tenantId: 'tenant-1' });
    prisma.jivoWebhookEvent.create.mockResolvedValue({
      id: 'event-1',
      payload: {
        sender: { id: 'visitor-1', type: 'client' },
        message: { id: 'msg-raw', type: 'text', text: 'hello', date: 1_700_000_000 },
      },
    });
    prisma.jivoWebhookEvent.update.mockResolvedValue({});
    prisma.conversation.findFirst.mockResolvedValue(null);
    prisma.conversation.create.mockResolvedValue({ id: 'conv-1' });
    prisma.message.create.mockResolvedValue({ id: 'msg-1' });

    const service = buildService();

    await service.handleWebhook(
      'secret',
      {
        sender: { id: 'visitor-1', type: 'client' },
        message: { id: 'msg-raw', type: 'text', text: 'hello', date: 1_700_000_000 },
      },
      {},
    );

    expect(prisma.jivoWebhookEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: WebhookEventStatus.PENDING }),
      }),
    );
    expect(prisma.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ externalUserId: 'visitor-1' }),
      }),
    );
    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          direction: MessageDirection.INBOUND,
          payloadType: MessagePayloadType.TEXT,
        }),
      }),
    );
    expect(prisma.messageAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ event: AuditEvent.RECEIVED }),
      }),
    );
    expect(queue.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'jivo-webhook',
        payload: expect.objectContaining({ eventId: 'event-1' }),
      }),
    );
  });
});
