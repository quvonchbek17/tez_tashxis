import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post()
  @ApiOperation({ summary: 'Yangi bemor yaratish' })
  @ApiResponse({ status: 201, description: 'Bemor muvaffaqiyatli yaratildi' })
  create(@Body() dto: CreatePatientDto, @GetUser() user: any) {
    return this.patientsService.create(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha bemorlarni olish' })
  @ApiResponse({ status: 200, description: 'Bemorlar ro‘yxati' })
  findAll(@GetUser() user: any) {
    return this.patientsService.findAll(user._id);
  }

  @Get('search-by-name')
  @ApiOperation({ summary: 'Bemorlarni ism bo‘yicha qidirish' })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'name',
    example: 'name',
  })
  search(@GetUser() user: any, @Query('name') name: string) {
    return this.patientsService.searchByName(name, user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta bemorni olish' })
  @ApiParam({ name: 'id', description: 'Bemor ID' })
  @ApiResponse({ status: 200, description: 'Bemor ma‘lumotlari' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.patientsService.findOne(id, user._id);
  }




  @Patch(':id')
  @ApiOperation({ summary: 'Bemor ma‘lumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Bemor ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto, @GetUser() user: any) {
    return this.patientsService.update(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bemorni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Bemor ID' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.patientsService.remove(id, user._id);
  }
}
