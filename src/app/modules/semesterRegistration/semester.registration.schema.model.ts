import mongoose, { Schema } from "mongoose";
import { TSemesterRegistration } from "./semester-registration.interface";
import { SemesterRegistrationStatus } from "./semester.registration.constants";


const SemesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>({
    academicSemester: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: "AcademicSemester"
    },
    status: {
        type: String,
        enum: SemesterRegistrationStatus,
        default: "UPCOMING"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    maxCredit: {
        type: Number,
        required: true,
        default: 15
    },
    minCredit: {
        type: Number,
        required: true,
        default: 3
    }

}, {
    timestamps: true
});


export const SemesterRegistrationModel = mongoose.model("SemesterRegistration", SemesterRegistrationSchema);