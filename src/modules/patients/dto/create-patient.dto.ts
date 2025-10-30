import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ description: 'Bemor ismi', example: 'Ali Valiyev' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tug‘ilgan yili', example: 1995 })
  @IsNumber()
  birthOn: number;

  @ApiProperty({ description: 'Telefon raqami', example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Tashxislar ro‘yxati (Diagnosis IDlar)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  diagnoses?: string[];
}
