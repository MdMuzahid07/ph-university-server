import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academic-department.interface";


const AcademicDepartmentSchema = new Schema<TAcademicDepartment>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        ref: "AcademicFaculty"
    }
},
    {
        timestamps: true
    }
);



// creating academic department model 

const AcademicDepartmentModel = model<TAcademicDepartment>("AcademicDepartment", AcademicDepartmentSchema);

export default AcademicDepartmentModel;
