import mongoose from "mongoose";
import { TSemesterRegistration } from "./semester-registration.interface";


const SemesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>({

});


export const SemesterRegistrationModel = mongoose.model("SemesterRegistration", SemesterRegistrationSchema);