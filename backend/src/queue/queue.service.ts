import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueEnvelope } from '@server-wa-b2b/contracts';
import type { Channel, Connection } from 'amqplib';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly url: string;
  private readonly queueName: string;

  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('queue.url') ?? '';
    this.queueName = this.configService.get<string>('queue.name') ?? 'wa-gateway-events';

    if (!this.url) {
      this.logger.warn('AMQP URL is not configured; queue publishing will be disabled');
    }
  }

  async publish(envelope: QueueEnvelope): Promise<void> {
    if (!this.url) {
      this.logger.debug('Skipping publish: queue URL is not configured');
      return;
    }

    const channel = await this.ensureChannel();
    channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(envelope)), {
      persistent: true,
    });
  }

  async acknowledge(eventId: string): Promise<void> {
    this.logger.debug({ eventId }, 'Received ACK from worker (not persisted yet)');
  }

  private async ensureChannel(): Promise<Channel> {
    if (!this.url) {
      throw new Error('AMQP URL is not configured');
    }

    if (this.channel) {
      return this.channel;
    }

    if (!this.connection) {
      this.connection = await amqp.connect(this.url);
      this.connection.on('close', () => {
        this.logger.warn('AMQP connection closed');
        this.connection = null;
        this.channel = null;
      });
      this.connection.on('error', (error) => {
        this.logger.error({ error }, 'AMQP connection error');
      });
    }

    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
    return this.channel;
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}
