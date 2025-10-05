import { SessionMode, WhatsappStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateWhatsappAccountDto {
  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{5,15}$/)
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(WhatsappStatus)
  status?: WhatsappStatus;

  @IsOptional()
  @IsEnum(SessionMode)
  sessionMode?: SessionMode;
}
