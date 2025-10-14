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
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@ApiTags('Diseases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi kasallik qo\'shish' })
  @ApiResponse({ status: 201, description: 'Kasallik muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  create(@Body() createDiseaseDto: CreateDiseaseDto, @GetUser() user: any) {
    return this.diseasesService.create(createDiseaseDto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kasalliklarni olish' })
  @ApiResponse({ status: 200, description: 'Kasalliklar ro\'yxati' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findAll(@GetUser() user: any) {
    return this.diseasesService.findAll(user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kasallikni olish' })
  @ApiParam({ name: 'id', description: 'Kasallik ID' })
  @ApiResponse({ status: 200, description: 'Kasallik ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Kasallik topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.diseasesService.findOne(id, user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kasallik ma\'lumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Kasallik ID' })
  @ApiResponse({ status: 200, description: 'Kasallik muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Kasallik topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto, @GetUser() user: any) {
    return this.diseasesService.update(id, updateDiseaseDto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kasallikni o\'chirish' })
  @ApiParam({ name: 'id', description: 'Kasallik ID' })
  @ApiResponse({ status: 200, description: 'Kasallik muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Kasallik topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.diseasesService.remove(id, user._id);
  }
}
