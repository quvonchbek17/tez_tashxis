import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsBoolean, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class DrugRelationDto {
  @ApiProperty({ description: 'Dori ID' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Standart tanlangan', default: false })
  @IsBoolean()
  @IsOptional()
  default?: boolean;
}

class AdviceRelationDto {
  @ApiProperty({ description: 'Maslahat ID' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Standart tanlangan', default: false })
  @IsBoolean()
  @IsOptional()
  default?: boolean;
}

export class CreateDiseaseDto {
  @ApiProperty({ description: 'Kasallik nomi', example: 'ORVI' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ICD kodi', example: 'J06.9' })
  @IsString()
  @IsNotEmpty()
  icd: string;

  @ApiProperty({
    description: 'Dorilar ro\'yxati',
    type: [DrugRelationDto],
    required: false
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DrugRelationDto)
  drugs?: DrugRelationDto[];

  @ApiProperty({
    description: 'Maslahatlar ro\'yxati',
    type: [AdviceRelationDto],
    required: false
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdviceRelationDto)
  advices?: AdviceRelationDto[];
}
