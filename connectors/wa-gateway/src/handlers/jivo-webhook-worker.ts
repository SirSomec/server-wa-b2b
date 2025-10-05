import { QueueEnvelope } from '@server-wa-b2b/contracts';

import { logger } from '../logger';
import { MessageProcessor } from '../message-processor';

export class JivoWebhookWorker {
  constructor(private readonly messageProcessor: MessageProcessor) {}

  async handle(envelope: QueueEnvelope): Promise<void> {
    if (envelope.type !== 'jivo-webhook') {
      return;
    }

    logger.debug({ eventId: envelope.payload.eventId }, 'Processing Jivo webhook event');
    // TODO: pull from backend if needed for idempotency, for now rely on direct payload
    await this.messageProcessor.process(envelope);
    logger.info({ eventId: envelope.payload.eventId }, 'Processed Jivo webhook event');
  }
}
