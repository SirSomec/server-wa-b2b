import type { QueueEnvelope } from '@server-wa-b2b/contracts';

import { JivoHandler } from './handlers/jivo-handler';
import { WhatsappHandler } from './handlers/whatsapp-handler';
import { logger } from './logger';

export class MessageProcessor {
  private readonly jivoHandler = new JivoHandler();
  private readonly whatsappHandler = new WhatsappHandler();

  async process(envelope: QueueEnvelope): Promise<void> {
    if (envelope.type !== 'message') {
      logger.debug({ envelopeType: envelope.type }, 'Skipping non-message envelope');
      return;
    }

    const message = envelope.payload;
    logger.debug({ message }, 'Processing message envelope');

    if (message.source === 'jivo' && message.direction === 'outbound') {
      await this.whatsappHandler.handleOutbound(message);
      return;
    }

    if (message.source === 'whatsapp' && message.direction === 'outbound') {
      await this.jivoHandler.handleOutbound(message);
      return;
    }

    logger.warn(
      { message },
      'Envelope direction/source combination is not yet supported by wa-gateway',
    );
  }
}
