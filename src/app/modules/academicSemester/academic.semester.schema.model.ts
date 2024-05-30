import { model, Schema } from "mongoose";
import { TAcademicSemester, TMonths } from "./academic.semester.interface";

const Months: TMonths[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const AcademicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    startMonth: {
        type: String,
        enum: Months
    },
    endMonth: {
        type: String,
        enum: Months
    }
},
    {
        timestamps: true
    }
);



// creating user model 

const AcademicSemesterModel = model<TAcademicSemester>("AcademicSemester", AcademicSemesterSchema);

export default AcademicSemesterModel;
