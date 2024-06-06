
import express from "express";
import { StudentRoutes } from "../modules/student/student.routes";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academic.semester.routes";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academic.faculty.routes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academic.department.routes";
import { FacultyRoutes } from "../modules/faculty/faculty.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { CourseRoute } from "../modules/course/course.routes";

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
    {
        path: "/academic-departments",
        route: AcademicDepartmentRoutes
    },
    {
        path: "/faculties",
        route: FacultyRoutes
    },
    {
        path: "/admins",
        route: AdminRoutes
    },
    {
        path: "/courses",
        route: CourseRoute
    }
]


moduleRoutes.forEach(route => router.use(route.path, route.route));


export default router;