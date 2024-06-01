import { TAcademicDepartment } from "./academic-department.interface";
import AcademicDepartmentModel from "./academic.department.schema.model";



const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {


    const result = await AcademicDepartmentModel.create(payload);

    return result;
};

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartmentModel.find();
    return result;
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartmentModel.findById(id);
    return result;
};

const updateAcademicDepartmentIntoDB = async (
    id: string,
    payload: Partial<TAcademicDepartment>,
) => {

    const result = await AcademicDepartmentModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};


export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB
};

