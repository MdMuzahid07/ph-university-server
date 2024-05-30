import { AcademicSemesterT, TAcademicSemesterCode, TAcademicSemesterName, TMonths } from "./academic.semester.interface";

export const Months: TMonths[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export const academicSemesterName: TAcademicSemesterName[] = ["Autumn", "Summer", "Fall"];
export const academicSemesterCode: TAcademicSemesterCode[] = ["01", "02", "03"];

export const academicSemesterNameCodeMapper: AcademicSemesterT = {
    Autumn: "01",
    Summer: "02",
    Fall: "03"
};
