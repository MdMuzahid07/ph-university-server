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

    return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
}






export const generateStudentId = async (payload: TAcademicSemester) => {

    // first time 0000
    const currentId = await findLastStudentId() || (0).toString();
    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");


    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;

};

