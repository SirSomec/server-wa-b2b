import { ChannelStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateJivoChannelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  outboundUrl?: string;

  @IsOptional()
  @IsString()
  inboundSecret?: string;

  @IsOptional()
  @IsEnum(ChannelStatus)
  status?: ChannelStatus;
}
