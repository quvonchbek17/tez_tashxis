import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drug, DrugDocument } from '../mongo';
import { CreateDrugDto, UpdateDrugDto } from './dto';

@Injectable()
export class DrugsService {
  constructor(
    @InjectModel(Drug.name)
    private readonly drugsModel: Model<DrugDocument>,
  ) {}

  async create(createDrugDto: CreateDrugDto, doctorId: string) {
    try {
      const drug = new this.drugsModel({
        ...createDrugDto,
        doctor: doctorId,
      });

      const savedDrug = await drug.save();
      return {
        success: true,
        data: savedDrug
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(doctorId: string) {
    try {
      const drugs = await this.drugsModel
        .find({ doctor: doctorId })
        .exec();
      return {
        success: true,
        data: drugs
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, doctorId: string) {
    try {
      const drug = await this.drugsModel.findOne({ _id: id, doctor: doctorId }).exec();

      if (!drug) {
        throw new NotFoundException('Dori topilmadi');
      }

      return {
        success: true,
        data: drug
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateDrugDto: UpdateDrugDto, doctorId: string) {
    try {
      const drug = await this.drugsModel.findOne({ _id: id, doctor: doctorId });

      if (!drug) {
        throw new NotFoundException('Dori topilmadi');
      }

      const updatedDrug = await this.drugsModel
        .findByIdAndUpdate(id, updateDrugDto, { new: true })
        .exec();

      return {
        success: true,
        data: updatedDrug
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
      const drug = await this.drugsModel.findOneAndDelete({ _id: id, doctor: doctorId }).exec();

      if (!drug) {
        throw new NotFoundException('Dori topilmadi');
      }

      return {
        success: true,
        message: 'Dori muvaffaqiyatli o\'chirildi'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
