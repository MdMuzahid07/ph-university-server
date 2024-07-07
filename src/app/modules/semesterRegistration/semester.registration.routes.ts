import express from "express";
import requestValidator from "../../middlewares/requestValidator";
import { SemesterRegistrationValidation } from "./semesterRegistration.Validation.schema";
import { SemesterRegistrationController } from "./semester.registration.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constants";

const router = express.Router();


router.post(
    "/create-semester-registration",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(SemesterRegistrationValidation.createSemesterRegistrationValidationSchema),
    SemesterRegistrationController.createSemesterRegistration
);


router.get("/:id",
    auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.superAdmin),
    SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch("/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    requestValidator(SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema), SemesterRegistrationController.updateSemesterRegistration
);

router.get("/",
    auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.superAdmin),
    SemesterRegistrationController.getAllSemesterRegistration
);

export const SemesterRegistrationRouter = router;