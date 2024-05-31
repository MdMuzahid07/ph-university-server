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

const getAllAcademicSemestersFromDB = async () => {
    const result = await AcademicSemesterModel.find();
    return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemesterModel.findById(id);
    return result;
};

const updateAcademicSemesterIntoDB = async (
    id: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new Error('Invalid Semester Code');
    }

    const result = await AcademicSemesterModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};


export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB
};

