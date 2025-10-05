import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma.module';

import { WhatsappAccountsController } from './whatsapp-accounts.controller';
import { WhatsappAccountsService } from './whatsapp-accounts.service';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsappAccountsController],
  providers: [WhatsappAccountsService],
  exports: [WhatsappAccountsService],
})
export class WhatsappAccountsModule {}
