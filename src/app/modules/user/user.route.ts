import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import requestValidator from "../../middlewares/requestValidator";

const router = express.Router();


router.post('/create-student', requestValidator(studentValidations.createStudentValidationSchema), UserController.createStudent);


export const UserRoutes = router;