import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AdvicesService } from './advices.service';
import { CreateAdviceDto, UpdateAdviceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@ApiTags('Advices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('advices')
export class AdvicesController {
  constructor(private readonly advicesService: AdvicesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi maslahat qo\'shish' })
  @ApiResponse({ status: 201, description: 'Maslahat muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  create(@Body() createAdviceDto: CreateAdviceDto, @GetUser() user: any) {
    return this.advicesService.create(createAdviceDto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha maslahatlarni olish' })
  @ApiResponse({ status: 200, description: 'Maslahatlar ro\'yxati' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findAll(@GetUser() user: any) {
    return this.advicesService.findAll(user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta maslahatni olish' })
  @ApiParam({ name: 'id', description: 'Maslahat ID' })
  @ApiResponse({ status: 200, description: 'Maslahat ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Maslahat topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.advicesService.findOne(id, user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Maslahat ma\'lumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Maslahat ID' })
  @ApiResponse({ status: 200, description: 'Maslahat muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Maslahat topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  update(@Param('id') id: string, @Body() updateAdviceDto: UpdateAdviceDto, @GetUser() user: any) {
    return this.advicesService.update(id, updateAdviceDto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Maslahatni o\'chirish' })
  @ApiParam({ name: 'id', description: 'Maslahat ID' })
  @ApiResponse({ status: 200, description: 'Maslahat muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Maslahat topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.advicesService.remove(id, user._id);
  }
}
