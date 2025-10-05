import { SessionMode, WhatsappStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateWhatsappAccountDto {
  @IsString()
  @IsNotEmpty()
  alias!: string;

  @IsString()
  @Matches(/^\+?[0-9]{5,15}$/)
  phoneNumber!: string;

  @IsOptional()
  @IsEnum(WhatsappStatus)
  status?: WhatsappStatus;

  @IsOptional()
  @IsEnum(SessionMode)
  sessionMode?: SessionMode;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
