import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Doctor, DoctorDocument } from '../mongo';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private readonly doctorsModel: Model<DoctorDocument>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const existingPhone = await this.doctorsModel.findOne({ phone: createDoctorDto.phone });
      if (existingPhone) {
        throw new ConflictException('Bu telefon raqami allaqachon ro\'yxatdan o\'tgan');
      }

      const existingLogin = await this.doctorsModel.findOne({ login: createDoctorDto.login });
      if (existingLogin) {
        throw new ConflictException('Bu login allaqachon ro\'yxatdan o\'tgan');
      }

      const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

      const doctor = new this.doctorsModel({
        ...createDoctorDto,
        password: hashedPassword,
      });

      const savedDoctor = await doctor.save();
      const doctorObject = savedDoctor.toObject();
      delete doctorObject.password;
      return {
        success: true,
        data: doctorObject
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const doctors = await this.doctorsModel
        .find()
        .select('-password')
        .exec();
      return {
        success: true,
        data: doctors
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const doctor = await this.doctorsModel.findById(id).select('-password').exec();

      if (!doctor) {
        throw new NotFoundException('Doctor topilmadi');
      }

      return {
        success: true,
        data: doctor
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    try {
      const doctor = await this.doctorsModel.findById(id);

      if (!doctor) {
        throw new NotFoundException('Doctor topilmadi');
      }

      if (updateDoctorDto.phone && updateDoctorDto.phone !== doctor.phone) {
        const existingPhone = await this.doctorsModel.findOne({ phone: updateDoctorDto.phone });
        if (existingPhone) {
          throw new ConflictException('Bu telefon raqami allaqachon ro\'yxatdan o\'tgan');
        }
      }

      if (updateDoctorDto.login && updateDoctorDto.login !== doctor.login) {
        const existingLogin = await this.doctorsModel.findOne({ login: updateDoctorDto.login });
        if (existingLogin) {
          throw new ConflictException('Bu login allaqachon ro\'yxatdan o\'tgan');
        }
      }

      const updateData: any = { ...updateDoctorDto };
      if (updateDoctorDto.password) {
        updateData.password = await bcrypt.hash(updateDoctorDto.password, 10);
      }

      const updatedDoctor = await this.doctorsModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .select('-password')
        .exec();

      return {
        success: true,
        data: updatedDoctor
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const doctor = await this.doctorsModel.findByIdAndDelete(id).exec();

      if (!doctor) {
        throw new NotFoundException('Doctor topilmadi');
      }

      return {
        success: true,
        message: 'Doctor muvaffaqiyatli o\'chirildi'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
