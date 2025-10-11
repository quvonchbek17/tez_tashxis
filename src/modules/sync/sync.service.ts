import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Drug, DrugDocument, Advice, AdviceDocument, Disease, DiseaseDocument, Patient, PatientDocument, DiagnosisStatistic, DiagnosisStatisticDocument, DiseaseDrug, DiseaseDrugDocument, DiseaseAdvice, DiseaseAdviceDocument } from '@modules';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(Drug.name) private readonly drugModel: Model<DrugDocument>,
    @InjectModel(Advice.name) private readonly adviceModel: Model<AdviceDocument>,
    @InjectModel(Disease.name) private readonly diseaseModel: Model<DiseaseDocument>,
    @InjectModel(DiseaseDrug.name) private readonly diseaseDrugModel: Model<DiseaseDrugDocument>,
    @InjectModel(DiseaseAdvice.name) private readonly diseaseAdviceModel: Model<DiseaseAdviceDocument>,
    @InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>,
    @InjectModel(DiagnosisStatistic.name) private readonly diagnosisStatsModel: Model<DiagnosisStatisticDocument>,
  ) {}

  /** GET /sync/all */
  async getAll(doctorId: string) {
    // parallel fetch for performance
    const [drugsRaw, advicesRaw, diseasesRaw, patientsRaw, diseaseDrugsRaw, diseaseAdvicesRaw] =
      await Promise.all([
        this.drugModel.find({ doctor_id: doctorId, is_active: { $ne: false } }).lean(),
        this.adviceModel.find({ doctor_id: doctorId, is_active: { $ne: false } }).lean(),
        this.diseaseModel.find({ doctor_id: doctorId, is_active: { $ne: false } }).lean(),
        this.patientModel.find({ doctor_id: doctorId }).lean(),
        this.diseaseDrugModel.find().lean(),
        this.diseaseAdviceModel.find().lean(),
      ]);

    // map drugs -> response shape
    const drugs = drugsRaw.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      form: d.form ?? null,
      strength: d.dosage ?? null, // our schema calls it `dosage`, sample expects `strength`
      manufacturer: (d as any).manufacturer ?? null, // optional field if you have it in schema
      category: (d as any).category ?? null,
      requiresPrescription: (d as any).requiresPrescription ?? false,
      notes: d.instructions ?? null,
    }));

    const advices = advicesRaw.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      description: a.content, // schema: content -> sample: description
      category: a.category ?? null,
    }));

    // build diseases with defaultDrugs / defaultAdvices
    const diseases = diseasesRaw.map((ds) => {
      const dd = diseaseDrugsRaw
        .filter((x) => x.disease_id?.toString() === ds._id.toString())
        .map((x) => ({
          drugId: x.drug_id?.toString(),
          priority: x.priority ?? 0,
          defaultSelected: !!x.default_selected,
          customDosage: x.custom_dosage ?? null,
        }));

      const da = diseaseAdvicesRaw
        .filter((x) => x.disease_id?.toString() === ds._id.toString())
        .map((x) => ({
          adviceId: x.advice_id?.toString(),
          priority: x.priority ?? 0,
          defaultSelected: !!x.default_selected,
        }));

      return {
        id: ds._id.toString(),
        name: ds.name,
        icdCode: (ds as any).icd_code ?? null,
        notes: ds.notes ?? null,
        defaultDrugs: dd,
        defaultAdvices: da,
      };
    });

    const patients = patientsRaw.map((p) => ({
      id: p._id.toString(),
      fullName: p.fullName,
      phone: p.phone,
      birthYear: p.birthYear ?? null,
      gender: p.gender ?? null,
      address: p.address ?? null,
    }));

    return {
      success: true,
      data: {
        drugs,
        advices,
        diseases,
        patients,
        serverTime: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  /**
   * POST /sync/upload
   * body may contain: diagnoses[], patients[], drugs[], advices[], diseases[]
   * user parameter is optional (from req.user)
   */
  async upload(body: any, user?: any) {
    const doctorId = user?._id || user?.id;

    if (!doctorId) {
      throw new Error('Doctor ID topilmadi');
    }

    const stats = {
      patients: { created: 0, updated: 0 },
      drugs: { created: 0, updated: 0 },
      advices: { created: 0, updated: 0 },
      diseases: { created: 0, updated: 0 },
      diagnoses: { created: 0 },
    };

    // 1) upsert patients
    if (Array.isArray(body.patients)) {
      for (const p of body.patients) {
        try {
          let filter: any;
          let isUpdate = false;

          // Agar id berilgan bo'lsa va valid ObjectId bo'lsa
          if (p.id && Types.ObjectId.isValid(p.id)) {
            filter = { _id: p.id, doctor_id: doctorId };
            const exists = await this.patientModel.findOne(filter);
            isUpdate = !!exists;
          } else {
            // id yo'q yoki invalid bo'lsa, phone bo'yicha qidirish (o'z doctor_id ichida)
            filter = { doctor_id: doctorId, phone: p.phone };
            const exists = await this.patientModel.findOne(filter);
            isUpdate = !!exists;
          }

          const update = {
            doctor_id: doctorId,
            fullName: p.fullName,
            phone: p.phone,
            birthYear: p.birthYear,
            gender: p.gender,
            address: p.address ?? null,
            updated_at: new Date(),
          };

          await this.patientModel.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });

          isUpdate ? stats.patients.updated++ : stats.patients.created++;
        } catch (err) {
          this.logger.error('Failed upsert patient', err);
        }
      }
    }

    // 2) upsert drugs
    if (Array.isArray(body.drugs)) {
      for (const d of body.drugs) {
        try {
          let filter: any;
          let isUpdate = false;

          if (d.id && Types.ObjectId.isValid(d.id)) {
            filter = { _id: d.id, doctor_id: doctorId };
            const exists = await this.drugModel.findOne(filter);
            isUpdate = !!exists;
          } else {
            filter = { doctor_id: doctorId, name: d.name };
            const exists = await this.drugModel.findOne(filter);
            isUpdate = !!exists;
          }

          const update = {
            doctor_id: doctorId,
            name: d.name,
            form: d.form ?? null,
            dosage: d.strength ?? d.dosage ?? null,
            instructions: d.notes ?? d.instructions ?? null,
            is_active: true,
            updated_at: new Date(),
          };

          await this.drugModel.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });

          isUpdate ? stats.drugs.updated++ : stats.drugs.created++;
        } catch (err) {
          this.logger.error('Failed upsert drug', err);
        }
      }
    }

    // 3) upsert advices
    if (Array.isArray(body.advices)) {
      for (const a of body.advices) {
        try {
          let filter: any;
          let isUpdate = false;

          if (a.id && Types.ObjectId.isValid(a.id)) {
            filter = { _id: a.id, doctor_id: doctorId };
            const exists = await this.adviceModel.findOne(filter);
            isUpdate = !!exists;
          } else {
            filter = { doctor_id: doctorId, title: a.title };
            const exists = await this.adviceModel.findOne(filter);
            isUpdate = !!exists;
          }

          const update = {
            doctor_id: doctorId,
            title: a.title,
            content: a.description ?? a.content ?? '',
            category: a.category ?? null,
            is_active: true,
            updated_at: new Date(),
          };

          await this.adviceModel.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });

          isUpdate ? stats.advices.updated++ : stats.advices.created++;
        } catch (err) {
          this.logger.error('Failed upsert advice', err);
        }
      }
    }

    // 4) upsert diseases
    if (Array.isArray(body.diseases)) {
      for (const ds of body.diseases) {
        try {
          let filter: any;
          let isUpdate = false;

          if (ds.id && Types.ObjectId.isValid(ds.id)) {
            filter = { _id: ds.id, doctor_id: doctorId };
            const exists = await this.diseaseModel.findOne(filter);
            isUpdate = !!exists;
          } else {
            filter = { doctor_id: doctorId, name: ds.name };
            const exists = await this.diseaseModel.findOne(filter);
            isUpdate = !!exists;
          }

          const update = {
            doctor_id: doctorId,
            name: ds.name,
            icd_code: ds.icdCode ?? ds.icd_code ?? null,
            notes: ds.notes ?? null,
            is_active: true,
            updated_at: new Date(),
          };

          const diseaseDoc = await this.diseaseModel.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });

          isUpdate ? stats.diseases.updated++ : stats.diseases.created++;

          // if defaultDrugs/defaultAdvices provided, upsert relation docs
          if (Array.isArray(ds.defaultDrugs)) {
            for (const rel of ds.defaultDrugs) {
              try {
                await this.diseaseDrugModel.findOneAndUpdate(
                  { disease_id: diseaseDoc._id, drug_id: rel.drugId },
                  {
                    disease_id: diseaseDoc._id,
                    drug_id: rel.drugId,
                    priority: rel.priority ?? 0,
                    default_selected: !!rel.defaultSelected,
                    custom_dosage: rel.customDosage ?? null,
                  },
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                );
              } catch (err) {
                this.logger.error('Failed upsert diseaseDrug relation', err);
              }
            }
          }

          if (Array.isArray(ds.defaultAdvices)) {
            for (const rel of ds.defaultAdvices) {
              try {
                await this.diseaseAdviceModel.findOneAndUpdate(
                  { disease_id: diseaseDoc._id, advice_id: rel.adviceId },
                  {
                    disease_id: diseaseDoc._id,
                    advice_id: rel.adviceId,
                    priority: rel.priority ?? 0,
                    default_selected: !!rel.defaultSelected,
                  },
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                );
              } catch (err) {
                this.logger.error('Failed upsert diseaseAdvice relation', err);
              }
            }
          }
        } catch (err) {
          this.logger.error('Failed upsert disease', err);
        }
      }
    }

    // 5) save diagnoses -> DiagnosisStatistic collection
    if (Array.isArray(body.diagnoses)) {
      for (const diag of body.diagnoses) {
        try {
          await this.diagnosisStatsModel.create({
            doctor_id: user?.id ?? diag.doctorId ?? null,
            patient_age: diag.patientAge ?? null,
            patient_gender: diag.patientGender ?? null,
            disease_ids: diag.diseaseIds ?? diag.disease_ids ?? [],
            drug_ids: (diag.drugs ?? []).map((dd) => dd.drugId),
            advice_ids: diag.advices ?? [],
            diagnosis_date: diag.createdAt ? new Date(diag.createdAt) : new Date(),
            session_duration: diag.sessionDuration ?? null,
            symptoms: diag.symptoms ?? null,
            notes: diag.notes ?? null,
            created_at: new Date(),
          });
          stats.diagnoses.created++;
        } catch (err) {
          this.logger.error('Failed create diagnosis', err);
        }
      }
    }

    return {
      success: true,
      data: {
        stats,
        message: `Patients: ${stats.patients.created} yangi, ${stats.patients.updated} yangilandi. ` +
                 `Drugs: ${stats.drugs.created} yangi, ${stats.drugs.updated} yangilandi. ` +
                 `Advices: ${stats.advices.created} yangi, ${stats.advices.updated} yangilandi. ` +
                 `Diseases: ${stats.diseases.created} yangi, ${stats.diseases.updated} yangilandi. ` +
                 `Diagnoses: ${stats.diagnoses.created} yangi.`,
      },
    };
  }
}
