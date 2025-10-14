import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advice, AdviceDocument } from '../mongo';
import { CreateAdviceDto, UpdateAdviceDto } from './dto';

@Injectable()
export class AdvicesService {
  constructor(
    @InjectModel(Advice.name)
    private readonly advicesModel: Model<AdviceDocument>,
  ) {}

  async create(createAdviceDto: CreateAdviceDto, doctorId: string) {
    try {
      const advice = new this.advicesModel({
        ...createAdviceDto,
        doctor: doctorId,
      });

      const savedAdvice = await advice.save();
      return {
        success: true,
        data: savedAdvice
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(doctorId: string) {
    try {
      const advices = await this.advicesModel
        .find({ doctor: doctorId })
        .exec();
      return {
        success: true,
        data: advices
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, doctorId: string) {
    try {
      const advice = await this.advicesModel.findOne({ _id: id, doctor: doctorId }).exec();

      if (!advice) {
        throw new NotFoundException('Maslahat topilmadi');
      }

      return {
        success: true,
        data: advice
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateAdviceDto: UpdateAdviceDto, doctorId: string) {
    try {
      const advice = await this.advicesModel.findOne({ _id: id, doctor: doctorId });

      if (!advice) {
        throw new NotFoundException('Maslahat topilmadi');
      }

      const updatedAdvice = await this.advicesModel
        .findByIdAndUpdate(id, updateAdviceDto, { new: true })
        .exec();

      return {
        success: true,
        data: updatedAdvice
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, doctorId: string) {
    try {
      const advice = await this.advicesModel.findOneAndDelete({ _id: id, doctor: doctorId }).exec();

      if (!advice) {
        throw new NotFoundException('Maslahat topilmadi');
      }

      return {
        success: true,
        message: 'Maslahat muvaffaqiyatli o\'chirildi'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
