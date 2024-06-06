import express from 'express';
import { StudentControllers } from './student.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from './student.validation';

const router = express.Router();


router.get('/', StudentControllers.getAllStudents);
router.get('/:id', StudentControllers.getSingleStudent);
router.delete('/:id', StudentControllers.deleteStudent);
router.patch(
    '/:id',
    requestValidator(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent
);


export const StudentRoutes = router;
