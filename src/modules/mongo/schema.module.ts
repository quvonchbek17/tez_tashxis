import { MongooseModule } from "@nestjs/mongoose";
import { Advice, AdviceSchema, DiagnosisStatistic, DiagnosisStatisticSchema, Disease, DiseaseAdvice, DiseaseAdviceSchema, DiseaseDrug, DiseaseDrugSchema, DiseaseSchema, Doctor, DoctorSchema, Drug, DrugSchema, Patient, PatientSchema } from "./schemas";

const schemas = [
    MongooseModule.forFeature([
        {name: Advice.name, schema: AdviceSchema},
        {name: DiagnosisStatistic.name, schema: DiagnosisStatisticSchema},
        {name: DiseaseAdvice.name, schema: DiseaseAdviceSchema},
        {name: DiseaseDrug.name, schema: DiseaseDrugSchema},
        {name: Disease.name, schema: DiseaseSchema},
        {name: Doctor.name, schema: DoctorSchema},
        {name: Drug.name, schema: DrugSchema},
        {name: Patient.name, schema: PatientSchema}
    ])
]

export default schemas