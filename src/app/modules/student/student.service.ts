import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import UserModel from '../user/user.schema.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './student.constants';



const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  // let searchTerm = " ";
  // const queryObj = { ...query };

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // };



  // const searchQuery = StudentModel.find({
  //   $or: ["email", "name.firstName", "presentAddress"].map((field) => (
  //     {
  //       [field]: { $regex: searchTerm, $options: "i" }
  //     }
  //   ))
  // })

  // filter




  // const filterQuery = searchQuery.find(queryObj)
  //   .populate({
  //     path: "academicDepartment",
  //     populate: {
  //       path: "academicFaculty"
  //     }
  //   }).populate("admissionSemester");


  // let sort = "-createdAt";

  // if (query.sort) {
  //   sort = query.sort as string;
  // };

  // const sortQuery = filterQuery.sort(sort);

  // let limit = 1;
  // let page = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // };

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);




  // field limiting



  // let fields = "-__v";

  // if (query.fields) {
  //   fields = (query.fields as string).split(",").join(" ");
  // }



  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;


  const studentQuery = new QueryBuilder(StudentModel.find(), query).search(searchableFields).filter().sort().paginate().fields();




  const res = await studentQuery.modelQuery;

  return res;

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
