import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Sign {
    @ApiProperty({ example: 'admin', description: 'Login' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: "Login minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
    @Matches(/^[a-zA-Z0-9]+$/, { message: "Loginda bo'sh joy(probel) ishlatish mumkin emas.Faqat raqam va harflar qatnashishi mumkin" })
    readonly login: string;

    @ApiProperty({ example: 'admin123', description: 'Parol' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: "Parol minimum 4, maximum 20 ta belgidan iborat bo'lishi kerak" })
    @Matches(/^[a-zA-Z0-9!@#$]+$/, { message: "Parolda bo'sh joy(probel) ishlatish mumkin emas. Faqat raqam, harf, (!, @, #, $) belgilari qatnashishi mumkin" })
    readonly password: string;
}