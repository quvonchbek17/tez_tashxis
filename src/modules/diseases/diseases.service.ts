import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disease, DiseaseDocument } from '../mongo';
import { CreateDiseaseDto, UpdateDiseaseDto } from './dto';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectModel(Disease.name)
    private readonly diseasesModel: Model<DiseaseDocument>,
  ) {}

  async create(createDiseaseDto: CreateDiseaseDto, doctorId: string) {
    try {
      const disease = new this.diseasesModel({
        name: createDiseaseDto.name,
        icd: createDiseaseDto.icd,
        drugs: createDiseaseDto.drugs || [],
        advices: createDiseaseDto.advices || [],
        doctor: doctorId,
      });

      const savedDisease = await disease.save();
      const populatedDisease = await this.diseasesModel
        .findById(savedDisease._id)
        .populate('drugs.id', 'name dose minAge maxAge')
        .populate('advices.id', 'text minAge maxAge')
        .exec();

      return {
        success: true,
        data: populatedDisease
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(doctorId: string) {
    try {
      const diseases = await this.diseasesModel
        .find({ doctor: doctorId })
        .populate('drugs.id', 'name dose minAge maxAge')
        .populate('advices.id', 'text minAge maxAge')
        .exec();
      return {
        success: true,
        data: diseases
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, doctorId: string) {
    try {
      const disease = await this.diseasesModel
        .findOne({ _id: id, doctor: doctorId })
        .populate('drugs.id', 'name dose minAge maxAge')
        .populate('advices.id', 'text minAge maxAge')
        .exec();

      if (!disease) {
        throw new NotFoundException('Kasallik topilmadi');
      }

      return {
        success: true,
        data: disease
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateDiseaseDto: UpdateDiseaseDto, doctorId: string) {
    try {
      const disease = await this.diseasesModel.findOne({ _id: id, doctor: doctorId });

      if (!disease) {
        throw new NotFoundException('Kasallik topilmadi');
      }

      const updatedDisease = await this.diseasesModel
        .findByIdAndUpdate(id, updateDiseaseDto, { new: true })
        .populate('drugs.id', 'name dose minAge maxAge')
        .populate('advices.id', 'text minAge maxAge')
        .exec();

      return {
        success: true,
        data: updatedDisease
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
      const disease = await this.diseasesModel.findOneAndDelete({ _id: id, doctor: doctorId }).exec();

      if (!disease) {
        throw new NotFoundException('Kasallik topilmadi');
      }

      return {
        success: true,
        message: 'Kasallik muvaffaqiyatli o\'chirildi'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
