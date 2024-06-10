import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import requestValidator from "../../middlewares/requestValidator";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constants";

const router = express.Router();


router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    requestValidator(studentValidations.createStudentValidationSchema),
    UserController.createStudent
);

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    requestValidator(createFacultyValidationSchema),
    UserController.createFaculty,
);

router.post(
    '/create-admin',
    // auth(USER_ROLE.admin),
    requestValidator(createAdminValidationSchema),
    UserController.createAdmin,
);


export const UserRoutes = router;