import express from 'express';
import { AcademicFacultyControllers } from './academic.faculty.controller';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicFacultyValidation } from './academic.faculty.validation';

const router = express.Router();

router.post("/create-academic-faculty", requestValidator(AcademicFacultyValidation.CreateAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

router.get(
    '/:facultyId',
    AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
    '/:facultyId',
    requestValidator(
        AcademicFacultyValidation.UpdateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
);


export const AcademicFacultyRoutes = router;
