import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, UnauthorizedException, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Sign } from './dto/sign.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument, Doctor, DoctorDocument } from 'modules/mongo';
import { appConfig } from '@configs';


@Injectable()
export class AuthService {
readonly #_doctorsModel: Model<DoctorDocument>;
readonly #_adminsModel: Model<AdminDocument>;
  constructor(
    @InjectModel(Doctor.name)
    doctorsModel: Model<DoctorDocument>,
    @InjectModel(Admin.name)
    adminsModel: Model<AdminDocument>,
    private readonly JwtService: JwtService
  ) {
    this.#_doctorsModel = doctorsModel;
    this.#_adminsModel = adminsModel;
  }

    async Sign(@Body() body: Sign){
      try {
        // Avval doctordan qidirish
        let user = await this.#_doctorsModel.findOne({login: body.login})
        let userType = 'doctor';

        // Agar doctor topilmasa, admindan qidirish
        if (!user) {
          user = await this.#_adminsModel.findOne({login: body.login})
          userType = 'admin';
        }

        if(!user) {
          throw new NotFoundException('User topilmadi')
        }

        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Login yoki parol noto\'g\'ri');
        }

        const token = this.sign(user.id)
        return {
          access_token: token,
          user_type: userType
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
        const doctor = await this.#_doctorsModel.findOne({_id: id})

        if(!doctor) {
            throw new NotFoundException('Doctor topilmadi')
        }

        return doctor
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException(error)
      }
    }

    async validateAdmin(id: string){
      try {
        const admin = await this.#_adminsModel.findOne({_id: id})

        if(!admin) {
            throw new NotFoundException('Admin topilmadi')
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