import { assertQueueEnvelope, QueueEnvelope } from '@server-wa-b2b/contracts';
import amqp from 'amqplib';

import { config } from './config';
import { logger } from './logger';

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection['createChannel']>>;

type MessageHandler = (
  envelope: QueueEnvelope,
  raw: AmqpChannel extends { consume: infer T }
    ? Parameters<NonNullable<T>>[1] extends (msg: infer M, ...args: any[]) => any
      ? NonNullable<M>
      : never
    : never,
  channel: AmqpChannel,
) => Promise<void>;

export class QueueClient {
  private connection: AmqpConnection | null = null;
  private channel: AmqpChannel | null = null;

  async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    const connection = await amqp.connect(config.amqpUrl);
    this.connection = connection;

    const channel = await connection.createChannel();
    await channel.assertQueue(config.queueName, { durable: true });
    channel.prefetch(config.prefetch);
    this.channel = channel;

    connection.on('close', () => {
      logger.warn('AMQP connection closed');
      this.connection = null;
      this.channel = null;
    });

    connection.on('error', (error: unknown) => {
      logger.error({ error }, 'AMQP connection error');
    });
  }

  async consume(handler: MessageHandler): Promise<void> {
    const channel = await this.ensureChannel();

    await channel.consume(
      config.queueName,
      async (msg) => {
        if (!msg) {
          return;
        }

        try {
          const data = JSON.parse(msg.content.toString());
          const envelope = assertQueueEnvelope(data);
          await handler(envelope, msg, channel);
          channel.ack(msg);
        } catch (error) {
          logger.error({ error }, 'Failed to process queue message');
          channel.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }

  async publish(envelope: QueueEnvelope): Promise<void> {
    const channel = await this.ensureChannel();

    channel.sendToQueue(config.queueName, Buffer.from(JSON.stringify(envelope)), {
      persistent: true,
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }

  private async ensureChannel(): Promise<AmqpChannel> {
    if (this.channel) {
      return this.channel;
    }

    if (!this.connection) {
      await this.connect();
    }

    if (!this.channel || !this.connection) {
      throw new Error('Failed to establish AMQP channel');
    }

    return this.channel;
  }
}
