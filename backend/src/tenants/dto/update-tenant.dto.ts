import { TenantStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxWhatsappSlots?: number;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
