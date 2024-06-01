import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import catchAsync from '../../utils/catchAsync';



const getAllStudents = catchAsync(
  async (req, res, next) => {
    const result = await StudentServices.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students are retrieved succesfully',
      data: result,
    });

  }

);

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student is retrieved succesfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
};