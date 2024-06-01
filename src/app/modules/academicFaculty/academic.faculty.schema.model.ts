import { model, Schema } from "mongoose";
import { TAcademicFaculty } from "./academic.faculty.interface";


const AcademicFacultySchema = new Schema<TAcademicFaculty>({
    name: {
        type: String,
        required: true,
        unique: true
    }
},
    {
        timestamps: true
    }
);



// creating academic faculty model 

const AcademicFacultyModel = model<TAcademicFaculty>("AcademicFaculty", AcademicFacultySchema);

export default AcademicFacultyModel;
