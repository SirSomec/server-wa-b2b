import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('platform-admin', 'tenant-admin')
  findAll(@CurrentUser() user: JwtPayload, @Query('tenantId') tenantId?: string) {
    const targetTenant = user.isPlatformAdmin ? (tenantId ?? null) : (user.tenantId ?? null);
    return this.rolesService.findAllByTenant(targetTenant);
  }

  @Post()
  @Roles('platform-admin', 'tenant-admin')
  create(@Body() dto: CreateRoleDto, @CurrentUser() user: JwtPayload) {
    const tenantId = user.isPlatformAdmin ? (dto.tenantId ?? null) : (user.tenantId ?? null);
    if (!tenantId && !user.isPlatformAdmin) {
      throw new BadRequestException('Tenant is required');
    }

    return this.rolesService.create({ ...dto, tenantId: tenantId ?? undefined });
  }

  @Patch(':id')
  @Roles('platform-admin')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('platform-admin')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
