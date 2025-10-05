import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { JivoChannelsModule } from './jivo-channels/jivo-channels.module';
import { JivoWebhookModule } from './jivo-webhook/jivo-webhook.module';
import { QueueModule } from './queue/queue.module';
import { RolesModule } from './roles/roles.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { WhatsappAccountsModule } from './whatsapp-accounts/whatsapp-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
    }),
    PrismaModule,
    QueueModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    JivoChannelsModule,
    WhatsappAccountsModule,
    JivoWebhookModule,
    HealthModule,
  ],
})
export class AppModule {}
