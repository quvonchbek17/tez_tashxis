import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAdviceDto {
  @ApiProperty({ description: 'Maslahat matni', example: 'Ko\'p suyuqlik iste\'mol qiling' })
  @IsString()
  @IsNotEmpty()
  text: string;

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
