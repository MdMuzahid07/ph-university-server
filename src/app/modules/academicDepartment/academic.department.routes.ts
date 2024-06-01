import express from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { AcademicDepartmentValidation } from './academic.department.validation';
import { AcademicDepartmentControllers } from './academic.department.controller';


const router = express.Router();

router.post("/create-academic-department", requestValidator(AcademicDepartmentValidation.CreateAcademicDepartmentValidationSchema), AcademicDepartmentControllers.createAcademicDepartment);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

router.get(
    '/:departmentId',
    AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
    '/:departmentId',
    requestValidator(
        AcademicDepartmentValidation.UpdateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
);


export const AcademicDepartmentRoutes = router;
