import { config } from './config';
import { JivoWebhookWorker } from './handlers/jivo-webhook-worker';
import { logger } from './logger';
import { MessageProcessor } from './message-processor';
import { QueueClient } from './queue';

async function main() {
  const queue = new QueueClient();
  const processor = new MessageProcessor();
  const jivoWorker = new JivoWebhookWorker(processor);

  await queue.connect();
  logger.info({ queue: config.queueName }, 'WA Gateway listening for messages');

  await queue.consume(async (envelope) => {
    if (envelope.type === 'jivo-webhook') {
      await jivoWorker.handle(envelope);
      return;
    }

    await processor.process(envelope);
  });
}

void main().catch((error) => {
  logger.error({ error }, 'WA Gateway failed to start');
  process.exit(1);
});
