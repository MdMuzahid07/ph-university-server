import { academicSemesterNameCodeMapper } from "./academic.semester.constants";
import { TAcademicSemester } from "./academic.semester.interface";
import AcademicSemesterModel from "./academic.semester.schema.model";


const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error("Academic semester code is not valid");
    }

    const result = await AcademicSemesterModel.create(payload);

    return result;
};



export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
};

