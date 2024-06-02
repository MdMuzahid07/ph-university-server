import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import UserModel from '../user/user.schema.model';
import httpStatus from 'http-status';



const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find().populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty"
    }
  }).populate("admissionSemester");
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id }).populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty"
    }
  }).populate("admissionSemester");
  return result;
};


const updateStudentIntoDB = async (id: string) => {
  const result = await StudentModel.findOneAndUpdate({ id })
  return result;
};


const deleteAStudent = async (id: string) => {

  const session = await mongoose.startSession();

  try {
    // start transaction 
    session.startTransaction();

    // transaction 1
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );


    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete student");
    }


    // transaction -2

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete user");
    };

    // save data permanently to DB, by committing

    await session.commitTransaction();
    await session.endSession();


    return deletedStudent;

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("failed to delete student");
  }

}


export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteAStudent,
  updateStudentIntoDB
};
