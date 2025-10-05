'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.queueEnvelopeSchema =
  exports.jivoWebhookPayloadSchema =
  exports.messageEnvelopeSchema =
  exports.participantSchema =
  exports.messagePayloadSchema =
  exports.keyboardPayloadSchema =
  exports.keyboardOptionSchema =
  exports.locationPayloadSchema =
  exports.mediaPayloadSchema =
  exports.textPayloadSchema =
  exports.messagePayloadTypeSchema =
  exports.messageSourceSchema =
  exports.messageDirectionSchema =
    void 0;
exports.assertMessageEnvelope = assertMessageEnvelope;
exports.assertQueueEnvelope = assertQueueEnvelope;
const zod_1 = require('zod');
exports.messageDirectionSchema = zod_1.z.enum(['inbound', 'outbound']);
exports.messageSourceSchema = zod_1.z.enum(['jivo', 'whatsapp', 'system']);
exports.messagePayloadTypeSchema = zod_1.z.enum([
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
exports.textPayloadSchema = zod_1.z.object({
  text: zod_1.z.string().min(1),
});
exports.mediaPayloadSchema = zod_1.z.object({
  url: zod_1.z.string().url(),
  mimeType: zod_1.z.string(),
  sizeBytes: zod_1.z.number().int().positive(),
  caption: zod_1.z.string().optional(),
});
exports.locationPayloadSchema = zod_1.z.object({
  latitude: zod_1.z.number().min(-90).max(90),
  longitude: zod_1.z.number().min(-180).max(180),
  name: zod_1.z.string().optional(),
  address: zod_1.z.string().optional(),
});
exports.keyboardOptionSchema = zod_1.z.object({
  id: zod_1.z.string().min(1),
  text: zod_1.z.string().min(1),
  image: zod_1.z.string().url().optional(),
});
exports.keyboardPayloadSchema = zod_1.z.object({
  title: zod_1.z.string().optional(),
  text: zod_1.z.string().optional(),
  multiple: zod_1.z.boolean().optional(),
  options: zod_1.z.array(exports.keyboardOptionSchema).min(1),
});
exports.messagePayloadSchema = zod_1.z.discriminatedUnion('type', [
  zod_1.z.object({ type: zod_1.z.literal('text'), data: exports.textPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('photo'), data: exports.mediaPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('video'), data: exports.mediaPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('audio'), data: exports.mediaPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('document'), data: exports.mediaPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('location'), data: exports.locationPayloadSchema }),
  zod_1.z.object({ type: zod_1.z.literal('keyboard'), data: exports.keyboardPayloadSchema }),
  zod_1.z.object({
    type: zod_1.z.literal('rate'),
    data: zod_1.z.object({ value: zod_1.z.number() }),
  }),
  zod_1.z.object({
    type: zod_1.z.literal('typing'),
    data: zod_1.z.object({ text: zod_1.z.string().optional() }),
  }),
  zod_1.z.object({ type: zod_1.z.literal('start'), data: zod_1.z.object({}) }),
  zod_1.z.object({ type: zod_1.z.literal('stop'), data: zod_1.z.object({}) }),
  zod_1.z.object({
    type: zod_1.z.literal('seen'),
    data: zod_1.z.object({ messageId: zod_1.z.string().optional() }),
  }),
]);
exports.participantSchema = zod_1.z.object({
  id: zod_1.z.string().min(1),
  name: zod_1.z.string().optional(),
  phone: zod_1.z.string().optional(),
  avatar: zod_1.z.string().url().optional(),
});
exports.messageEnvelopeSchema = zod_1.z.object({
  tenantId: zod_1.z.string().uuid(),
  conversationId: zod_1.z.string().uuid(),
  correlationId: zod_1.z.string().uuid().optional(),
  direction: exports.messageDirectionSchema,
  source: exports.messageSourceSchema,
  payload: exports.messagePayloadSchema,
  sender: exports.participantSchema,
  recipient: exports.participantSchema.optional(),
  occurredAt: zod_1.z.string(),
  metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.jivoWebhookPayloadSchema = zod_1.z.object({
  eventId: zod_1.z.string().uuid(),
  tenantId: zod_1.z.string().uuid(),
  jivoChannelId: zod_1.z.string().uuid(),
  raw: zod_1.z.record(zod_1.z.any()),
  headers: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.queueEnvelopeSchema = zod_1.z.discriminatedUnion('type', [
  zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.literal('message'),
    createdAt: zod_1.z.string(),
    payload: exports.messageEnvelopeSchema,
  }),
  zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.literal('jivo-webhook'),
    createdAt: zod_1.z.string(),
    payload: exports.jivoWebhookPayloadSchema,
  }),
]);
function assertMessageEnvelope(payload) {
  return exports.messageEnvelopeSchema.parse(payload);
}
function assertQueueEnvelope(payload) {
  return exports.queueEnvelopeSchema.parse(payload);
}
