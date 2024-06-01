
import express from "express";
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academic.semester.routes";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academic.faculty.routes";

const router = express.Router();



const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/students",
        route: StudentRoutes
    },
    {
        path: "/academic-semesters",
        route: AcademicSemesterRoutes
    },
    {
        path: "/academic-faculties",
        route: AcademicFacultyRoutes
    },
]


moduleRoutes.forEach(route => router.use(route.path, route.route));


export default router;