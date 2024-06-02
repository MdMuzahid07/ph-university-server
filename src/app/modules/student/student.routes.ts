import express from 'express';
import { StudentControllers } from './student.controller';
import requestValidator from '../../middlewares/requestValidator';
import { studentValidations } from './student.validation';

const router = express.Router();


router.get('/', StudentControllers.getAllStudents);
router.get('/:studentId', StudentControllers.getSingleStudent);
router.delete('/:studentId', StudentControllers.deleteStudent);
router.patch(
    '/:studentId',
    requestValidator(studentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent
);


export const StudentRoutes = router;
