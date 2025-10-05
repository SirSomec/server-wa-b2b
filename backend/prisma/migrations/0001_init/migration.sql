CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR');
CREATE TYPE "CredentialType" AS ENUM ('WEBHOOK_SECRET', 'BASIC_AUTH', 'TOKEN');
CREATE TYPE "WhatsappStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'PAUSED', 'ERROR');
CREATE TYPE "SessionMode" AS ENUM ('HEADLESS', 'CLOUD');
CREATE TYPE "SessionState" AS ENUM ('PENDING_QR', 'READY', 'EXPIRED');
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'PENDING', 'CLOSED');
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');
CREATE TYPE "MessageSource" AS ENUM ('JIVO', 'WHATSAPP', 'SYSTEM');
CREATE TYPE "MessagePayloadType" AS ENUM ('TEXT', 'PHOTO', 'VIDEO', 'AUDIO', 'DOCUMENT', 'LOCATION', 'KEYBOARD', 'RATE', 'TYPING', 'START', 'STOP', 'SEEN');
CREATE TYPE "DeliveryChannel" AS ENUM ('JIVO_OUTBOUND', 'JIVO_INBOUND', 'WA_OUTBOUND', 'WA_INBOUND');
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE "AuditEvent" AS ENUM ('RECEIVED', 'ENQUEUED', 'DEQUEUED', 'TRANSFORMED', 'SENT', 'ACKNOWLEDGED', 'ERROR');

CREATE TABLE "Tenant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "max_whatsapp_slots" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "email" VARCHAR(255),
    "display_name" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_platform_admin" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "scopes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserRoleAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JivoChannel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "outbound_url" VARCHAR(2048) NOT NULL,
    "inbound_secret" VARCHAR(128) NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JivoChannel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChannelCredential" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "channel_id" UUID NOT NULL,
    "type" "CredentialType" NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChannelCredential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsappAccount" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "alias" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(32) NOT NULL,
    "status" "WhatsappStatus" NOT NULL DEFAULT 'ONBOARDING',
    "session_mode" "SessionMode" NOT NULL DEFAULT 'HEADLESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WhatsappAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WaSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsapp_account_id" UUID NOT NULL,
    "session_state" "SessionState" NOT NULL DEFAULT 'PENDING_QR',
    "session_data_ref" VARCHAR(512) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WaSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Conversation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "jivo_channel_id" UUID NOT NULL,
    "whatsapp_account_id" UUID NOT NULL,
    "external_user_id" VARCHAR(255) NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "source" "MessageSource" NOT NULL,
    "payload_type" "MessagePayloadType" NOT NULL,
    "text" TEXT,
    "payload" JSONB NOT NULL,
    "correlation_id" UUID,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "delivered_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageMedia" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "storage_key" VARCHAR(512) NOT NULL,
    "original_url" VARCHAR(2048),
    "mime_type" VARCHAR(128) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryAttempt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "channel" "DeliveryChannel" NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "http_status" INTEGER,
    "error_code" VARCHAR(128),
    "error_message" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageAuditLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "event" "AuditEvent" NOT NULL,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TenantWeeklyMetric" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "messages_inbound" INTEGER NOT NULL,
    "messages_outbound" INTEGER NOT NULL,
    "errors_jivo" INTEGER NOT NULL,
    "errors_whatsapp" INTEGER NOT NULL,
    "avg_delivery_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TenantWeeklyMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MaintenanceRunLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "job_name" VARCHAR(128) NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'SUCCESS',
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "message" TEXT,
    CONSTRAINT "MaintenanceRunLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
CREATE UNIQUE INDEX "users_tenant_email_key" ON "User"("tenant_id", "email");
CREATE UNIQUE INDEX "roles_tenant_code_key" ON "Role"("tenant_id", "code");
CREATE UNIQUE INDEX "user_role_unique" ON "UserRoleAssignment"("user_id", "role_id");
CREATE UNIQUE INDEX "channel_credential_unique" ON "ChannelCredential"("channel_id", "type");
CREATE UNIQUE INDEX "tenant_phone_unique" ON "WhatsappAccount"("tenant_id", "phone_number");
CREATE INDEX "Conversation_tenant_external_idx" ON "Conversation"("tenant_id", "external_user_id");
CREATE INDEX "Message_tenant_conversation_sent_idx" ON "Message"("tenant_id", "conversation_id", "sent_at");
CREATE INDEX "Message_correlation_id_idx" ON "Message"("correlation_id");
CREATE INDEX "MessageMedia_expires_at_idx" ON "MessageMedia"("expires_at");
CREATE INDEX "DeliveryAttempt_tenant_attempted_idx" ON "DeliveryAttempt"("tenant_id", "attempted_at");
CREATE INDEX "MessageAuditLog_tenant_created_idx" ON "MessageAuditLog"("tenant_id", "created_at");
CREATE UNIQUE INDEX "tenant_week_unique" ON "TenantWeeklyMetric"("tenant_id", "week_start");
CREATE INDEX "MaintenanceRunLog_job_started_idx" ON "MaintenanceRunLog"("job_name", "started_at");

ALTER TABLE "User"
  ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Role"
  ADD CONSTRAINT "Role_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserRoleAssignment"
  ADD CONSTRAINT "UserRoleAssignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "UserRoleAssignment_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JivoChannel"
  ADD CONSTRAINT "JivoChannel_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChannelCredential"
  ADD CONSTRAINT "ChannelCredential_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "JivoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsappAccount"
  ADD CONSTRAINT "WhatsappAccount_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WaSession"
  ADD CONSTRAINT "WaSession_whatsapp_account_id_fkey" FOREIGN KEY ("whatsapp_account_id") REFERENCES "WhatsappAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "Conversation_jivo_channel_id_fkey" FOREIGN KEY ("jivo_channel_id") REFERENCES "JivoChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Conversation_whatsapp_account_id_fkey" FOREIGN KEY ("whatsapp_account_id") REFERENCES "WhatsappAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "Message_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MessageMedia"
  ADD CONSTRAINT "MessageMedia_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeliveryAttempt"
  ADD CONSTRAINT "DeliveryAttempt_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "DeliveryAttempt_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MessageAuditLog"
  ADD CONSTRAINT "MessageAuditLog_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "MessageAuditLog_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenantWeeklyMetric"
  ADD CONSTRAINT "TenantWeeklyMetric_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MaintenanceRunLog"
  ADD CONSTRAINT "MaintenanceRunLog_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
