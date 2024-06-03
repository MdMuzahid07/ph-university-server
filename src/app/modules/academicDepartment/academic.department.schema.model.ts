import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academic-department.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


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




AcademicDepartmentSchema.pre("save", async function (next) {

    // we can use Direct model name or , we can use also this.model, but not supported in TS
    const isDepartmentExists = await AcademicDepartmentModel.findOne({ name: this.name });

    if (isDepartmentExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This department is already exists");
    }

    next();

});


AcademicDepartmentSchema.pre("findOneAndUpdate", async function (next) {

    const query = this.getQuery();

    const isDepartmentExists = await AcademicDepartmentModel.findOne(query);

    if (!isDepartmentExists) {
        throw new AppError(httpStatus.NOT_FOUND, "This Department doesn't exists for update");
    }

    next();
});





// creating academic department model 

const AcademicDepartmentModel = model<TAcademicDepartment>("AcademicDepartment", AcademicDepartmentSchema);

export default AcademicDepartmentModel;
