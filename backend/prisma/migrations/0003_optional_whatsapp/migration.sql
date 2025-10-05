ALTER TABLE "Conversation" ALTER COLUMN "whatsapp_account_id" DROP NOT NULL;
ALTER TABLE "Conversation" DROP CONSTRAINT IF EXISTS "Conversation_whatsapp_account_id_fkey";
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_whatsapp_account_id_fkey" FOREIGN KEY ("whatsapp_account_id") REFERENCES "WhatsappAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
