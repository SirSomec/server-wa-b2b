import { z } from 'zod';

export const messageDirectionSchema = z.enum(['inbound', 'outbound']);
export type MessageDirection = z.infer<typeof messageDirectionSchema>;

export const messageSourceSchema = z.enum(['jivo', 'whatsapp', 'system']);
export type MessageSource = z.infer<typeof messageSourceSchema>;

export const messagePayloadTypeSchema = z.enum([
  'text',
  'photo',
  'video',
  'audio',
  'document',
  'location',
  'keyboard',
  'rate',
  'typing',
  'start',
  'stop',
  'seen',
]);
export type MessagePayloadType = z.infer<typeof messagePayloadTypeSchema>;

export const textPayloadSchema = z.object({
  text: z.string().min(1),
});

export const mediaPayloadSchema = z.object({
  url: z.string().url(),
  mimeType: z.string(),
  sizeBytes: z.number().int().positive(),
  caption: z.string().optional(),
});

export const locationPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
  address: z.string().optional(),
});

export const keyboardOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  image: z.string().url().optional(),
});

export const keyboardPayloadSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  multiple: z.boolean().optional(),
  options: z.array(keyboardOptionSchema).min(1),
});

export const messagePayloadSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), data: textPayloadSchema }),
  z.object({ type: z.literal('photo'), data: mediaPayloadSchema }),
  z.object({ type: z.literal('video'), data: mediaPayloadSchema }),
  z.object({ type: z.literal('audio'), data: mediaPayloadSchema }),
  z.object({ type: z.literal('document'), data: mediaPayloadSchema }),
  z.object({ type: z.literal('location'), data: locationPayloadSchema }),
  z.object({ type: z.literal('keyboard'), data: keyboardPayloadSchema }),
  z.object({ type: z.literal('rate'), data: z.object({ value: z.number() }) }),
  z.object({ type: z.literal('typing'), data: z.object({ text: z.string().optional() }) }),
  z.object({ type: z.literal('start'), data: z.object({}) }),
  z.object({ type: z.literal('stop'), data: z.object({}) }),
  z.object({ type: z.literal('seen'), data: z.object({ messageId: z.string().optional() }) }),
]);
export type MessagePayload = z.infer<typeof messagePayloadSchema>;

export const participantSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});
export type Participant = z.infer<typeof participantSchema>;

export const messageEnvelopeSchema = z.object({
  tenantId: z.string().uuid(),
  conversationId: z.string().uuid(),
  correlationId: z.string().uuid().optional(),
  direction: messageDirectionSchema,
  source: messageSourceSchema,
  payload: messagePayloadSchema,
  sender: participantSchema,
  recipient: participantSchema.optional(),
  occurredAt: z.string(),
  metadata: z.record(z.any()).optional(),
});
export type MessageEnvelope = z.infer<typeof messageEnvelopeSchema>;

export const jivoWebhookPayloadSchema = z.object({
  eventId: z.string().uuid(),
  tenantId: z.string().uuid(),
  jivoChannelId: z.string().uuid(),
  raw: z.record(z.any()),
  headers: z.record(z.any()).optional(),
});
export type JivoWebhookPayload = z.infer<typeof jivoWebhookPayloadSchema>;

export const queueEnvelopeSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().uuid(),
    type: z.literal('message'),
    createdAt: z.string(),
    payload: messageEnvelopeSchema,
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('jivo-webhook'),
    createdAt: z.string(),
    payload: jivoWebhookPayloadSchema,
  }),
]);
export type QueueEnvelope = z.infer<typeof queueEnvelopeSchema>;

export function assertMessageEnvelope(payload: unknown): MessageEnvelope {
  return messageEnvelopeSchema.parse(payload);
}

export function assertQueueEnvelope(payload: unknown): QueueEnvelope {
  return queueEnvelopeSchema.parse(payload);
}
