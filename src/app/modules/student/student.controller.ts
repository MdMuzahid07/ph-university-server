import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';



const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  res.status(200).json({
    success: true,
    message: 'Students are retrieved succesfully',
    data: result,
  });

});

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await StudentServices.getSingleStudentFromDB(id);

    res.status(200).json({
      success: true,
      message: 'Student is retrieved succesfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const updateStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { student } = req.body;
    const result = await StudentServices.updateStudentIntoDB(id, student);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Student is updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await StudentServices.deleteAStudent(id);

    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent
};
