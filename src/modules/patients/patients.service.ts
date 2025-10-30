import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from '../mongo';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto, doctorId: string) {
    try {
      const existing = await this.patientModel.findOne({
        phoneNumber: createPatientDto.phoneNumber,
      });
      if (existing) {
        throw new ConflictException('Bu telefon raqam allaqachon ro‘yxatdan o‘tgan');
      }

      const patient = new this.patientModel({
        ...createPatientDto,
        doctor: new Types.ObjectId(doctorId),
        diagnoses: createPatientDto.diagnoses?.map((id) => new Types.ObjectId(id)) || [],
      });

      const saved = await patient.save();

      const populated = await this.patientModel
        .findById(saved._id)
        .populate('doctor', 'full_name specialization')
        .populate('diagnoses', 'date file')
        .exec();

      return { success: true, data: populated };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(doctorId: string) {
    try {
      const patients = await this.patientModel
        .find({ doctor: doctorId })
        .populate('doctor', 'full_name specialization')
        .populate('diagnoses', 'date file')
        .exec();

      return { success: true, data: patients };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, doctorId: string) {
    try {
      const patient = await this.patientModel
        .findOne({ _id: id, doctor: doctorId })
        .populate('doctor', 'full_name specialization')
        .populate('diagnoses', 'date file')
        .exec();

      if (!patient) throw new NotFoundException('Bemor topilmadi');

      return { success: true, data: patient };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, dto: UpdatePatientDto, doctorId: string) {
    try {
      const patient = await this.patientModel.findOne({ _id: id, doctor: doctorId });
      if (!patient) throw new NotFoundException('Bemor topilmadi');

      const updated = await this.patientModel
        .findByIdAndUpdate(id, dto, { new: true })
        .populate('doctor', 'full_name specialization')
        .populate('diagnoses', 'date file')
        .exec();

      return { success: true, data: updated };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, doctorId: string) {
    try {
      const deleted = await this.patientModel.findOneAndDelete({ _id: id, doctor: doctorId });
      if (!deleted) throw new NotFoundException('Bemor topilmadi');
      return { success: true, message: 'Bemor muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error);
    }
  }
}
