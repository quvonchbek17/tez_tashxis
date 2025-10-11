import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Matches, Length } from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: '+998901234567', description: 'Doctor phone number' })
  @IsString()
  @IsOptional()
  @Matches(/^\+998\d{9}$/, { message: 'Phone must be in format +998XXXXXXXXX' })
  phone?: string;

  @ApiPropertyOptional({ example: 'doctor1', description: 'Doctor login' })
  @IsString()
  @IsOptional()
  @Length(4, 20, { message: "Login minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^[a-zA-Z0-9]+$/, { message: "Loginda bo'sh joy(probel) ishlatish mumkin emas.Faqat raqam va harflar qatnashishi mumkin" })
  login?: string;

  @ApiPropertyOptional({ example: 'Dr. John Doe', description: 'Doctor full name' })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'New password' })
  @IsString()
  @IsOptional()
  @Length(4, 20, { message: "Parol minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
  password?: string;

  @ApiPropertyOptional({ example: 'Cardiologist', description: 'Doctor specialization' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({ example: 'LIC-12345', description: 'Doctor license number' })
  @IsString()
  @IsOptional()
  license_number?: string;

  @ApiPropertyOptional({ example: true, description: 'Is doctor active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
