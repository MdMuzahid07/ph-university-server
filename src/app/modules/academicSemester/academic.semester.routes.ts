import express from 'express';
import { AcademicSemesterControllers } from './academic.semester.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicSemesterValidation } from './academic.semester.validation';

const router = express.Router();

router.post("/create-academic-semester", requestValidator(AcademicSemesterValidation.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester);

export const AcademicSemesterRoutes = router;
