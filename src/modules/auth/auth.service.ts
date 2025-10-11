import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, UnauthorizedException, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Sign } from './dto/sign.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from 'modules/mongo';
import { appConfig } from '@configs';


@Injectable()
export class AuthService {
readonly #_doctorsModel: Model<DoctorDocument>;
  constructor(
    @InjectModel(Doctor.name)
    doctorsModel: Model<DoctorDocument>,
    private readonly JwtService: JwtService
  ) {
    this.#_doctorsModel = doctorsModel;
  }

    async Sign(@Body() body: Sign){
      try {
        const admin = await this.#_doctorsModel.findOne({login: body.login})

        if(!admin) {
          throw new NotFoundException('User topilmadi')
        }

        const isPasswordValid = await bcrypt.compare(body.password, admin.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Login yoki parol noto\'g\'ri');
        }

        const token = this.sign(admin.id)
        return {
          access_token: token
        }

      } catch (error) {
        if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
          throw error;
        }
        throw new InternalServerErrorException(error)
      }
    }


    sign(payload: string) {
       try {
        return this.JwtService.sign({ id: payload }, {
            secret: appConfig().secret_key
        })
       } catch (error) {
        throw new InternalServerErrorException(error)
       }
    }

    verify(payload: string) {
        try {
          return this.JwtService.verify(payload, {
            secret: appConfig().secret_key
          });
        } catch(error) {
         throw new InternalServerErrorException(error)
        }
      }

    async validateUser(id: string){
      try {
        const admin = await this.#_doctorsModel.findOne({_id: id})

        if(!admin) {
            throw new NotFoundException('User topilmadi')
        }

        return admin
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException(error)
      }

    }
}