import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { academicSemesterNameCodeMapper } from "./academic.semester.constants";
import { TAcademicSemester } from "./academic.semester.interface";
import AcademicSemesterModel from "./academic.semester.schema.model";


const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.BAD_REQUEST, "Academic semester code is not valid");
    }

    const result = await AcademicSemesterModel.create(payload);

    return result;
};

const getAllAcademicSemestersFromDB = async (query) => {

    let result;

    if (query) {
        result = await AcademicSemesterModel.find(query)
    } else {
        result = await AcademicSemesterModel.find()
    }

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
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
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

