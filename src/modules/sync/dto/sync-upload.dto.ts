import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class SyncUploadDto {
  @ApiPropertyOptional({
    description: 'Dorilar (yangi yoki yangilangan)',
    type: 'array',
    example: [
      {
        id: '507f1f77bcf86cd799439011',
        name: 'Paracetamol',
        form: 'Tabletka',
        strength: '500mg',
        manufacturer: null,
        category: null,
        requiresPrescription: false,
        notes: 'Qabul qilish bo\'yicha yo\'riqnoma',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  drugs?: any[];

  @ApiPropertyOptional({
    description: 'Maslahatlar (yangi yoki yangilangan)',
    type: 'array',
    example: [
      {
        id: '507f1f77bcf86cd799439012',
        title: 'Ko\'proq suyuqlik ichish',
        description: 'Kuniga kamida 2 litr suv ichish tavsiya etiladi',
        category: 'umumiy',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  advices?: any[];

  @ApiPropertyOptional({
    description: 'Kasalliklar (yangi yoki yangilangan)',
    type: 'array',
    example: [
      {
        id: '507f1f77bcf86cd799439014',
        name: 'Gripp',
        icdCode: 'J11',
        notes: 'Mavsumiy gripp',
        defaultDrugs: [
          {
            drugId: '507f1f77bcf86cd799439011',
            priority: 1,
            defaultSelected: true,
            customDosage: '3 marta kuniga',
          },
        ],
        defaultAdvices: [
          {
            adviceId: '507f1f77bcf86cd799439012',
            priority: 1,
            defaultSelected: true,
          },
        ],
      },
    ],
  })
  @IsArray()
  @IsOptional()
  diseases?: any[];

  @ApiPropertyOptional({
    description: 'Bemorlar (yangi yoki yangilangan)',
    type: 'array',
    example: [
      {
        id: '507f1f77bcf86cd799439015',
        fullName: 'Sardor Karimov',
        phone: '+998901234567',
        birthYear: 1990,
        gender: 'erkak',
        address: 'Toshkent',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  patients?: any[];

  @ApiPropertyOptional({
    description: 'Tashxislar',
    type: 'array',
    example: [
      {
        doctorId: '507f1f77bcf86cd799439013',
        patientAge: 35,
        patientGender: 'erkak',
        diseaseIds: ['507f1f77bcf86cd799439014'],
        drugs: [{ drugId: '507f1f77bcf86cd799439011' }],
        advices: ['507f1f77bcf86cd799439012'],
        createdAt: '2025-01-15T10:30:00Z',
        sessionDuration: 300,
        symptoms: ['Bosh og\'rig\'i', 'Isitma'],
        notes: 'Bemor holati yaxshi',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  diagnoses?: any[];
}
