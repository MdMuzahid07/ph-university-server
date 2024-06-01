import { TAcademicSemester } from "../academicSemester/academic.semester.interface";
import UserModel from "./user.schema.model";



const findLastStudentId = async () => {
    const lastStudent = await UserModel.findOne({
        role: "student"
    },
        {
            id: 1,
            _id: 0
        }
    )
        //sorting to get last student id
        .sort({
            createdAt: -1
        })
        .lean();

    return lastStudent?.id ? lastStudent.id : undefined;
}



export const generateStudentId = async (payload: TAcademicSemester) => {

    let currentId = (0).toString(); // by default

    const lastStudentId = await findLastStudentId();
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
    const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
    const currentSemesterCode = payload.code;
    const currentSemesterYear = payload.year;


    if (lastStudentId && lastStudentSemesterCode === currentSemesterCode && lastStudentSemesterYear === currentSemesterYear) {
        currentId = lastStudentId.substring(6);
    }


    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");


    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;

};

