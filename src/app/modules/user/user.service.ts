import mongoose from "mongoose";
import config from "../../config";
import AcademicSemesterModel from "../academicSemester/academic.semester.schema.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.schema.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import AcademicDepartmentModel from "../academicDepartment/academic.department.schema.model";
import { Faculty } from "../faculty/faculty.schema.model";
import { Admin } from "../admin/admin.model";
import { VerifyToken } from "../auth/auth.utils";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {



    // create a user object
    const userData: Partial<TUser> = {};


    // if password not given use default password
    userData.password = password || (config.default_password as string);


    // set student role
    userData.role = "student";

    // set student email
    userData.email = studentData?.email;



    // find academic semester info 
    const admissionSemesterInfo = await AcademicSemesterModel.findById(studentData.admissionSemester.toString());




    // create an isolated environment, by starting an session using startSession() method by mongoose


    const session = await mongoose.startSession();


    try {

        // starting session by calling startTransaction();
        session.startTransaction();


        if (!admissionSemesterInfo) {
            throw new Error("academic semester not found");
        }
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


const createFacultyIntoDB = async (password: string, payload: TFaculty) => {

    // create a user object
    const userData: Partial<TUser> = {};

    // if password is not given, use default password
    userData.password = password || (config.default_password as string);

    // set student role
    userData.role = "faculty";

    // set faculty email
    userData.email = payload?.email;

    // find academic department info
    const academicDepartment = await AcademicDepartmentModel.findById(
        payload.academicDepartment
    );

    if (!academicDepartment) {
        throw new AppError(httpStatus.BAD_REQUEST, "Academic department not found");
    };



    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // set generated id
        userData.id = await generateFacultyId();

        // create a user (transaction-1)
        const newUser = await UserModel.create([userData], { session }); //array

        // create a faculty
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
        };

        // set id , _id as string
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a faculty (transaction-2)


        // create a faculty (transaction-2)

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }



};


const createAdminIntoDB = async (password: string, payload: TFaculty) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'admin';

    // set admin email
    userData.email = payload?.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await UserModel.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMe = async (userId: string, role: string) => {

    let result = null;
    if (role === "student") {
        result = await StudentModel.findOne({ id: userId });
    };
    if (role === "admin") {
        result = await Admin.findOne({ id: userId });
    };
    if (role === "faculty") {
        result = await Faculty.findOne({ id: userId });
    };

    return result;
};


const changeStatus = async (id: string, payload: { payload: status }) => {

    const result = await UserModel.findByIdAndUpdate(id, payload, {
        new: true
    });

    return result;
};



export const UserService = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeStatus
};