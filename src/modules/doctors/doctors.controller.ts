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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('Doctors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi doctor qo\'shish' })
  @ApiResponse({ status: 201, description: 'Doctor muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 409, description: 'Telefon raqami allaqachon ro\'yxatdan o\'tgan' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha doctorlarni olish' })
  @ApiResponse({ status: 200, description: 'Doctorlar ro\'yxati' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta doctorni olish' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Doctor ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Doctor topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Doctor ma\'lumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Doctor muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Doctor topilmadi' })
  @ApiResponse({ status: 409, description: 'Telefon raqami allaqachon ro\'yxatdan o\'tgan' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Doctorni o\'chirish' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Doctor muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Doctor topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
