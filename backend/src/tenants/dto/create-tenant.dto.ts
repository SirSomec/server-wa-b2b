import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsInt()
  @Min(1)
  maxWhatsappSlots!: number;
}
