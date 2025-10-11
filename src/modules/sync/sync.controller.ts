import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from 'modules/auth';
import { SyncUploadDto } from './dto';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('all')
  @ApiOperation({ summary: 'Barcha ma\'lumotlarni olish (faqat o\'z doctor_id bilan)' })
  @ApiResponse({ status: 200, description: 'Barcha kolleksiyalardan ma\'lumotlar' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  async getAll(@Req() req) {
    const doctorId = req.user?._id || req.user?.id;
    return this.syncService.getAll(doctorId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Ma\'lumotlarni sinxronizatsiya qilish (yangi yoki yangilangan)' })
  @ApiResponse({ status: 200, description: 'Ma\'lumotlar muvaffaqiyatli saqlandi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  async uploadData(@Body() body: SyncUploadDto, @Req() req) {
    return this.syncService.upload(body, req.user);
  }
}
