import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import requestValidator from "../../middlewares/requestValidator";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constants";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();


router.post(
    '/create-student',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    requestValidator(studentValidations.createStudentValidationSchema),
    UserController.createStudent
);

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    requestValidator(createFacultyValidationSchema),
    UserController.createFaculty,
);

router.post(
    '/create-admin',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    requestValidator(createAdminValidationSchema),
    UserController.createAdmin,
);

router.get(
    '/me',
    auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
    UserController.getMe,
);


router.post(
    '/change-status/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(UserValidation.ChangeStatusValidationSchema),
    UserController.changeStatus,
);



export const UserRoutes = router;