import config from "../../config";
import AcademicSemesterModel from "../academicSemester/academic.semester.schema.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.schema.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {



    // create a user object
    const userData: Partial<TUser> = {};


    // if password not given use default password
    userData.password = password || config.default_password as string;


    // set student role
    userData.role = "student"



    // find academic semester info 
    const admissionSemesterInfo = await AcademicSemesterModel.findById(studentData.admissionSemester.toString());

    // set generated id
    userData.id = await generateStudentId(admissionSemesterInfo);

    // create a user

    const newUser = await UserModel.create(userData);

    // create a student 

    if (Object.keys(newUser).length) {
        // set id , _id as user

        studentData.id = newUser.id;

        studentData.user = newUser._id; // reference _id

        const newStudent = await StudentModel.create(studentData);
        return newStudent;
    }


};

export const UserService = {
    createStudentIntoDB
}