import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import UserModel from '../user/user.schema.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';



const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  let searchTerm = " ";

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  };

  const result = await StudentModel.find({
    $or: ["email", "name.firstName", "presentAddress"].map((field) => (
      {
        [field]: { $regex: searchTerm, $options: "i" }
      }
    ))
  }).populate({
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


const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {



  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingStudentData }


  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }


  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }


  const result = await StudentModel.findOneAndUpdate({ id }, modifiedUpdatedData, { new: true, runValidators: true });
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
