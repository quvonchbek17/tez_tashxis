import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDrugDto {
  @ApiProperty({ description: 'Dori nomi', example: 'Paracetamol' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Dozasi', example: '500mg' })
  @IsString()
  @IsNotEmpty()
  dose: string;

  @ApiProperty({ description: 'Minimal yosh', example: 0 })
  @IsNumber()
  @Min(0)
  minAge: number;

  @ApiProperty({ description: 'Maksimal yosh (ixtiyoriy)', example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxAge?: number;
}
