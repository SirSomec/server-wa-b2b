import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { CreateJivoChannelDto } from './dto/create-jivo-channel.dto';
import { UpdateJivoChannelDto } from './dto/update-jivo-channel.dto';
import { JivoChannelsService } from './jivo-channels.service';

@Controller('jivo-channels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JivoChannelsController {
  constructor(private readonly jivoChannelsService: JivoChannelsService) {}

  @Get()
  @Roles('platform-admin', 'tenant-admin')
  findAll(@CurrentUser() user: JwtPayload) {
    const tenantId = user.tenantId;

    if (!tenantId) {
      return [];
    }

    return this.jivoChannelsService.findAllByTenant(tenantId);
  }

  @Post()
  @Roles('platform-admin', 'tenant-admin')
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateJivoChannelDto) {
    const tenantId = dto.tenantId ?? user.tenantId;

    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.jivoChannelsService.create({ ...dto, tenantId });
  }

  @Patch(':id')
  @Roles('platform-admin', 'tenant-admin')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateJivoChannelDto,
  ) {
    const tenantId = user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.jivoChannelsService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles('platform-admin', 'tenant-admin')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const tenantId = user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.jivoChannelsService.remove(id, tenantId);
  }
}
