import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('platform-admin', 'tenant-admin')
  findAll(@CurrentUser() user: JwtPayload, @Query('tenantId') tenantId?: string) {
    const targetTenant = tenantId ?? user.tenantId;
    if (!targetTenant) {
      return [];
    }

    return this.usersService.findAllByTenant(targetTenant);
  }

  @Get(':id')
  @Roles('platform-admin', 'tenant-admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('platform-admin', 'tenant-admin')
  create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtPayload) {
    const tenantScopedDto: CreateUserDto = {
      ...dto,
      tenantId: dto.tenantId ?? user.tenantId,
    };

    return this.usersService.create(tenantScopedDto);
  }

  @Patch(':id')
  @Roles('platform-admin', 'tenant-admin')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}
