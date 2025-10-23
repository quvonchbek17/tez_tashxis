import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiagnosesService } from './diagnoses.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import { Express } from 'express'; // ✅ to‘g‘ri import

@ApiTags('Diagnoses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  // 📤 Fayl yuklash (POST)
  @Post('upload')
  @ApiOperation({ summary: 'Yangi tashxis yuklash (PDF fayl orqali)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patient: {
          type: 'string',
          example: '671fa684c622ef63e2a6123d',
          description: 'Tashxis tegishli bo‘lgan patient ID',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF fayl',
        },
      },
      required: ['patient', 'file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Tashxis muvaffaqiyatli yuklandi' })
  @ApiResponse({ status: 400, description: 'Xatolik: noto‘g‘ri ma’lumot' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadDiagnosis(
    @UploadedFile() file: Express.Multer.File,
    @Body('patient') patient: string,
    @GetUser() user: any, // doctor ID token orqali
  ) {
    if (!file) throw new BadRequestException('Fayl topilmadi');
    if (!patient) throw new BadRequestException('Patient ID kerak');
    const doctorId = user._id;

    return this.diagnosesService.uploadDiagnosis(file,doctorId, patient);
  }

  // 📜 Barcha tashxislar
  @Get()
  @ApiOperation({ summary: 'Barcha tashxislarni olish' })
  @ApiResponse({ status: 200, description: 'Tashxislar ro‘yxati' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findAll(@GetUser() user: any) {
    return this.diagnosesService.findAll(user._id);
  }

  // 🔍 Bitta tashxis
  @Get(':id')
  @ApiOperation({ summary: 'Bitta tashxisni olish' })
  @ApiParam({ name: 'id', description: 'Tashxis ID' })
  @ApiResponse({ status: 200, description: 'Tashxis ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Tashxis topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.diagnosesService.getDiagnosis(id, user._id);
  }

  // 🗑️ O‘chirish
  @Delete(':id')
  @ApiOperation({ summary: 'Tashxisni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Tashxis ID' })
  @ApiResponse({ status: 200, description: 'Tashxis muvaffaqiyatli o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Tashxis topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.diagnosesService.deleteDiagnosis(id, user._id);
  }
}
