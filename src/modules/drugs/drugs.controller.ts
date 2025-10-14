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
import { DrugsService } from './drugs.service';
import { CreateDrugDto, UpdateDrugDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@ApiTags('Drugs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi dori qo\'shish' })
  @ApiResponse({ status: 201, description: 'Dori muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  create(@Body() createDrugDto: CreateDrugDto, @GetUser() user: any) {
    return this.drugsService.create(createDrugDto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha dorilarni olish' })
  @ApiResponse({ status: 200, description: 'Dorilar ro\'yxati' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findAll(@GetUser() user: any) {
    return this.drugsService.findAll(user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta dorini olish' })
  @ApiParam({ name: 'id', description: 'Dori ID' })
  @ApiResponse({ status: 200, description: 'Dori ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Dori topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.drugsService.findOne(id, user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Dori ma\'lumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Dori ID' })
  @ApiResponse({ status: 200, description: 'Dori muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Dori topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto, @GetUser() user: any) {
    return this.drugsService.update(id, updateDrugDto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dorini o\'chirish' })
  @ApiParam({ name: 'id', description: 'Dori ID' })
  @ApiResponse({ status: 200, description: 'Dori muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Dori topilmadi' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya xatosi' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.drugsService.remove(id, user._id);
  }
}
