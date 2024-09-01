import { academicSemesterNameCodeMapper, AcademicSemesterSearchableFields } from "./academic.semester.constants";
import { TAcademicSemester } from "./academic.semester.interface";
import AcademicSemesterModel from "./academic.semester.schema.model";
import QueryBuilder from "../../builder/QueryBuilder";


const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }

    const result = await AcademicSemesterModel.create(payload);
    return result;
};

const getAllAcademicSemestersFromDB = async (
    query: Record<string, unknown>,
) => {
    const academicSemesterQuery = new QueryBuilder(AcademicSemesterModel.find(), query)
        .search(AcademicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();

    return {
        meta,
        result,
    };
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

