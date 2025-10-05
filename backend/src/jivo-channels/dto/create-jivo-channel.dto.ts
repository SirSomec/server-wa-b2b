import { ChannelStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateJivoChannelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUrl()
  outboundUrl!: string;

  @IsString()
  inboundSecret!: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsEnum(ChannelStatus)
  status?: ChannelStatus;
}
