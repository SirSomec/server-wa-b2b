import type { MessageEnvelope } from '@server-wa-b2b/contracts';

import { logger } from '../logger';

export class JivoHandler {
  async handleOutbound(message: MessageEnvelope): Promise<void> {
    logger.debug({ message }, 'Outbound message to Jivo (stub)');
    // TODO: implement HTTP client to Chat API endpoint, map payload.
  }
}
