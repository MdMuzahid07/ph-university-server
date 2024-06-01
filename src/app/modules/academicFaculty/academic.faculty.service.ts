import { TAcademicFaculty } from "./academic.faculty.interface";
import AcademicFacultyModel from "./academic.faculty.schema.model";



const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {


    const result = await AcademicFacultyModel.create(payload);

    return result;
};

const getAllAcademicFacultiesFromDB = async () => {
    const result = await AcademicFacultyModel.find();
    return result;
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFacultyModel.findById(id);
    return result;
};

const updateAcademicFacultyIntoDB = async (
    id: string,
    payload: Partial<TAcademicFaculty>,
) => {

    const result = await AcademicFacultyModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};


export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    updateAcademicFacultyIntoDB,
    getSingleAcademicFacultyFromDB
};

