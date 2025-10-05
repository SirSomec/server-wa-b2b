import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma.module';

import { JivoChannelsController } from './jivo-channels.controller';
import { JivoChannelsService } from './jivo-channels.service';

@Module({
  imports: [PrismaModule],
  controllers: [JivoChannelsController],
  providers: [JivoChannelsService],
  exports: [JivoChannelsService],
})
export class JivoChannelsModule {}
