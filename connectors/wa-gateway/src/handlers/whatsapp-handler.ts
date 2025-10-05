import type { MessageEnvelope } from '@server-wa-b2b/contracts';

import { logger } from '../logger';

export class WhatsappHandler {
  async handleOutbound(message: MessageEnvelope): Promise<void> {
    logger.debug({ message }, 'Outbound message to WhatsApp (stub)');
    // TODO: integrate with whatsapp-web.js or cloud API.
  }

  async handleInbound(raw: unknown): Promise<MessageEnvelope> {
    logger.debug({ raw }, 'Inbound message from WhatsApp (stub)');
    // TODO: transform WA event into MessageEnvelope.
    throw new Error('handleInbound not implemented');
  }
}
