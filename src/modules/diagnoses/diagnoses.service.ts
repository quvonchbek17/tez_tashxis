import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MinioService } from 'nestjs-minio-client';
import { Model, Types } from 'mongoose';
import { Diagnosis, DiagnosisDocument } from '../mongo/schemas/diagnosis.schema';
import * as path from 'path';
import * as crypto from 'crypto';
import { minioConfig } from '@configs';
import { Patient, PatientDocument } from 'modules/mongo';

@Injectable()
export class DiagnosesService {
    constructor(
        @InjectModel(Diagnosis.name) private diagnosisModel: Model<DiagnosisDocument>,
        @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
        private readonly minioService: MinioService,
    ) { }

    private readonly bucketName = 'diagnoses';

    async uploadDiagnosis(file: Express.Multer.File, doctor: string, patient?: string) {
        if (!file) throw new BadRequestException('Fayl yuklanmagan');
        if (!doctor) throw new BadRequestException('date yoki doctor kiritilmagan');
        const patientData = await this.patientModel.findOne({ _id: patient, doctor: doctor })

        if (!patientData) {
            throw new NotFoundException("Bemor topilmadi")
        }


        const fileExt = path.extname(file.originalname);
        const fileName = `${crypto.randomUUID()}${fileExt}`;

        await this.minioService.client.putObject(
            this.bucketName,
            fileName,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype },
        );

        const fileUrl = `${minioConfig().minioPublicUrl || 'http://localhost:9000'}/${this.bucketName}/${fileName}`;

        const diagnosis = await this.diagnosisModel.create({
            date: new Date().toISOString(),
            file: fileUrl,
            doctor: new Types.ObjectId(doctor),
            patient: patient ? new Types.ObjectId(patient) : undefined,
        });

        await this.patientModel.updateOne(
            { _id: patient },
            { $push: { diagnoses: diagnosis._id } },
        );

        return diagnosis;
    }

    async findAll(doctorId: string) {
        return this.diagnosisModel
            .find({ doctor: doctorId })
            .populate('patient', 'name phoneNumber')
            .sort({ created_at: -1 });
    }

    async getDiagnosis(id: string, doctorId: string) {
        const diagnosis = await this.diagnosisModel
            .findOne({ _id: id, doctor: doctorId })
            .populate('patient', 'name phoneNumber');
        if (!diagnosis) throw new NotFoundException('Tashxis topilmadi');
        return diagnosis;
    }

    async deleteDiagnosis(id: string, doctorId: string) {
        const diagnosis = await this.diagnosisModel.findOne({ _id: id, doctor: doctorId });
        if (!diagnosis) throw new NotFoundException('Tashxis topilmadi');

        const fileName = diagnosis.file.split('/').pop();
        await this.minioService.client.removeObject(this.bucketName, fileName);
        await this.diagnosisModel.deleteOne({ _id: id });
        return { message: 'Tashxis o‘chirildi' };
    }
}
