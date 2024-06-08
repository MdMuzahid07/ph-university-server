import express from "express";
import requestValidator from "../../middlewares/requestValidator";
import { SemesterRegistrationValidation } from "./semesterRegistration.Validation.schema";
import { SemesterRegistrationController } from "./semester.registration.controller";


const router = express.Router();


router.post(
    "/create-semester-registration",
    requestValidator(SemesterRegistrationValidation.createSemesterRegistrationValidationSchema),
    SemesterRegistrationController.createSemesterRegistration
);


router.get("/:id", SemesterRegistrationController.getSingleSemesterRegistration);

router.patch("/:id", requestValidator(SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema), SemesterRegistrationController.updateSemesterRegistration);

router.get("/", SemesterRegistrationController.getAllSemesterRegistration);

export const SemesterRegistrationRouter = router;