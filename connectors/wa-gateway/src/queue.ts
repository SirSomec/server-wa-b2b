import { assertQueueEnvelope, QueueEnvelope } from '@server-wa-b2b/contracts';
import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

import { config } from './config';
import { logger } from './logger';

type MessageHandler = (
  envelope: QueueEnvelope,
  raw: ConsumeMessage,
  channel: Channel,
) => Promise<void>;

export class QueueClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    this.connection = await amqp.connect(config.amqpUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(config.queueName, { durable: true });
    this.channel.prefetch(config.prefetch);

    this.connection.on('close', () => {
      logger.warn('AMQP connection closed');
      this.connection = null;
      this.channel = null;
    });

    this.connection.on('error', (error) => {
      logger.error({ error }, 'AMQP connection error');
    });
  }

  async consume(handler: MessageHandler): Promise<void> {
    if (!this.channel) {
      throw new Error('Queue client not connected');
    }

    await this.channel.consume(
      config.queueName,
      async (msg) => {
        if (!msg) {
          return;
        }

        try {
          const data = JSON.parse(msg.content.toString());
          const envelope = assertQueueEnvelope(data);
          await handler(envelope, msg, this.channel!);
          this.channel!.ack(msg);
        } catch (error) {
          logger.error({ error }, 'Failed to process queue message');
          this.channel!.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }

  async publish(envelope: QueueEnvelope): Promise<void> {
    if (!this.channel) {
      throw new Error('Queue client not connected');
    }

    this.channel.sendToQueue(config.queueName, Buffer.from(JSON.stringify(envelope)), {
      persistent: true,
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}
