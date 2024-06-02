import mongoose from "mongoose";
import config from "../../config";
import AcademicSemesterModel from "../academicSemester/academic.semester.schema.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.schema.model";
import { generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {



    // create a user object
    const userData: Partial<TUser> = {};


    // if password not given use default password
    userData.password = password || config.default_password as string;


    // set student role
    userData.role = "student"



    // find academic semester info 
    const admissionSemesterInfo = await AcademicSemesterModel.findById(studentData.admissionSemester.toString());




    // create an isolated environment, by starting an session using startSession() method by mongoose


    const session = await mongoose.startSession();


    try {

        // starting session by calling startTransaction();
        session.startTransaction();


        // set generated id
        userData.id = await generateStudentId(admissionSemesterInfo);

        // create a user( transaction-1 )

        const newUser = await UserModel.create([userData], { session }); // newUser became an array after using transaction

        // create a student 

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "failed to crate user");
        };

        // set id , _id as user

        studentData.id = newUser[0].id;

        studentData.user = newUser[0]._id; // reference _id

        // create a student ( transaction-2 )
        const newStudent = await StudentModel.create([studentData], { session });


        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "failed to create student");
        };


        // permanently save writing in DB by committing the transaction
        await session.commitTransaction();

        // end session
        await session.endSession();

        return newStudent;


    } catch (error) {
        // if any error occurs , the transaction will be abort, and session will be end
        await session.abortTransaction();
        await session.endSession();
    }

};

export const UserService = {
    createStudentIntoDB
};