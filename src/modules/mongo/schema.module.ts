import { MongooseModule } from "@nestjs/mongoose";
import { Advice, AdviceSchema } from "./schemas/advices.schema";
import { Admin, AdminSchema } from "./schemas/admins.schema";
import { Disease, DiseaseSchema } from "./schemas/diseases.schema";
import { Doctor, DoctorSchema } from "./schemas/doctors.schema";
import { Drug, DrugSchema } from "./schemas/drugs.schema";

const schemas = [
    MongooseModule.forFeature([{ name: Advice.name, schema: AdviceSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Drug.name, schema: DrugSchema }])
]

export default schemas