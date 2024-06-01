import { StudentModel } from './student.model';



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


export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
