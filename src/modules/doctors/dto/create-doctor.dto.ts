import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, Matches, Length } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: '+998901234567', description: 'Doctor phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998\d{9}$/, { message: 'Phone must be in format +998XXXXXXXXX' })
  phone: string;

  @ApiProperty({ example: 'doctor1', description: 'Doctor login' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, { message: "Login minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^[a-zA-Z0-9]+$/, { message: "Loginda bo'sh joy(probel) ishlatish mumkin emas.Faqat raqam va harflar qatnashishi mumkin" })
  login: string;

  @ApiProperty({ example: 'Dr. John Doe', description: 'Doctor full name' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'password123', description: 'Doctor password' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, { message: "Parol minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
  password: string;

  @ApiPropertyOptional({ example: 'Cardiologist', description: 'Doctor specialization' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({ example: 'LIC-12345', description: 'Doctor license number' })
  @IsString()
  @IsOptional()
  license_number?: string;

  @ApiPropertyOptional({ example: true, description: 'Is doctor active', default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
