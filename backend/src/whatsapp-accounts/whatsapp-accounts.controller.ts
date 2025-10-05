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

import { CreateWhatsappAccountDto } from './dto/create-whatsapp-account.dto';
import { UpdateWhatsappAccountDto } from './dto/update-whatsapp-account.dto';
import { WhatsappAccountsService } from './whatsapp-accounts.service';

@Controller('whatsapp-accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WhatsappAccountsController {
  constructor(private readonly whatsappAccountsService: WhatsappAccountsService) {}

  @Get()
  @Roles('platform-admin', 'tenant-admin')
  findAll(@CurrentUser() user: JwtPayload) {
    const tenantId = user.tenantId;
    if (!tenantId) {
      return [];
    }

    return this.whatsappAccountsService.findAllByTenant(tenantId);
  }

  @Post()
  @Roles('platform-admin', 'tenant-admin')
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateWhatsappAccountDto) {
    const tenantId = dto.tenantId ?? user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.whatsappAccountsService.create({ ...dto, tenantId });
  }

  @Patch(':id')
  @Roles('platform-admin', 'tenant-admin')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWhatsappAccountDto,
  ) {
    const tenantId = user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.whatsappAccountsService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles('platform-admin', 'tenant-admin')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const tenantId = user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant is required');
    }

    return this.whatsappAccountsService.remove(id, tenantId);
  }
}
