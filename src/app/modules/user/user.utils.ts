import { TAcademicSemester } from "../academicSemester/academic.semester.interface";

export const generateStudentId = (payload: TAcademicSemester) => {

    // first time 0000
    const currentId = (0).toString();
    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");


    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;

};

