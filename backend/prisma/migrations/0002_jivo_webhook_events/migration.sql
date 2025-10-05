CREATE TYPE "WebhookEventStatus" AS ENUM (''PENDING'', ''PROCESSED'', ''FAILED'');

CREATE TABLE "JivoWebhookEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "jivo_channel_id" UUID NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT ''PENDING'',
    "payload" JSONB NOT NULL,
    "headers" JSONB NOT NULL,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    CONSTRAINT "JivoWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "JivoWebhookEvent_tenant_created_idx" ON "JivoWebhookEvent"("tenant_id", "created_at");
CREATE INDEX "JivoWebhookEvent_status_created_idx" ON "JivoWebhookEvent"("status", "created_at");

ALTER TABLE "JivoWebhookEvent"
  ADD CONSTRAINT "JivoWebhookEvent_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "JivoWebhookEvent_jivo_channel_id_fkey" FOREIGN KEY ("jivo_channel_id") REFERENCES "JivoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
