import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import requestValidator from "../../middlewares/requestValidator";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../admin/admin.validation";

const router = express.Router();


router.post('/create-student', requestValidator(studentValidations.createStudentValidationSchema), UserController.createStudent);



router.post(
    '/create-faculty',
    requestValidator(createFacultyValidationSchema),
    UserController.createFaculty,
);

router.post(
    '/create-admin',
    requestValidator(createAdminValidationSchema),
    UserController.createAdmin,
);

export const UserRoutes = router;