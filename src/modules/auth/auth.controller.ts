import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Sign } from './dto/sign.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login qilish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli login' })
  @ApiResponse({ status: 404, description: 'User topilmadi' })
  async SignIn(@Body() body: Sign ){
      return await this.authService.Sign(body)
  }
}