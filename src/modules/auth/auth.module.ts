import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongoModule } from 'modules/mongo';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards';

@Module({
  imports: [
    MongoModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule { }
