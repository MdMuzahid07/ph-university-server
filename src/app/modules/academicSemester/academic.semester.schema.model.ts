import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academic.semester.interface";
import { academicSemesterCode, academicSemesterName, Months } from "./academic.semester.constants";


const AcademicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        required: true,
        enum: academicSemesterName
    },
    year: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        enum: academicSemesterCode
    },
    startMonth: {
        type: String,
        required: true,
        enum: Months
    },
    endMonth: {
        type: String,
        required: true,
        enum: Months
    }
},
    {
        timestamps: true
    }
);



// checking current semester exists or not
AcademicSemesterSchema.pre("save", async function (next) {
    const isSemesterExists = await AcademicSemesterModel.findOne({
        name: this.name,
        year: this.year
    });

    if (isSemesterExists) {
        throw new Error("Semester is already exists")
    } else {
        next();
    }
});






// creating user model 

const AcademicSemesterModel = model<TAcademicSemester>("AcademicSemester", AcademicSemesterSchema);

export default AcademicSemesterModel;
