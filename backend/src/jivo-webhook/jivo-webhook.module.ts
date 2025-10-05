import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma.module';
import { QueueModule } from '../queue/queue.module';

import { JivoEventProcessorService } from './jivo-event-processor.service';
import { JivoWebhookController } from './jivo-webhook.controller';
import { JivoWebhookService } from './jivo-webhook.service';

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [JivoWebhookController],
  providers: [JivoWebhookService, JivoEventProcessorService],
})
export class JivoWebhookModule {}
