import { z } from 'zod';

const nameValidationSchema = z.object({
    firstName: z.string().trim().min(1).max(20, "Name cannot be more than 20 characters"),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim(),
});

const guardianValidationSchema = z.object({
    fatherName: z.string().trim(),
    motherName: z.string().trim(),
    fatherContactNo: z.string().trim(),
    motherContactNo: z.string().trim(),
    fatherOccupation: z.string().trim(),
    motherOccupation: z.string().trim(),
});

const localGuardianValidationSchema = z.object({
    name: z.string().trim(),
    occupation: z.string().trim(),
    contactNo: z.string().trim(),
    address: z.string().trim(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20),
        student: z.object({
            name: nameValidationSchema,
            gender: z.enum(["male", "female", "others"]),
            dateOfBirth: z.string().optional(),
            email: z
                .string()
                .email({ message: '{VALUE} is not a valid email' })
            ,
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            contactNumber: z.string().trim(),
            emergencyContactNo: z.string().trim(),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            presentAddress: z.string().trim(),
            permanentAddress: z.string().trim(),
            profileImage: z.string().optional(),
            admissionSemester: z.string(),
            isDeleted: z.boolean().default(false),
            academicDepartment: z.string()
        })
    })
})
export const studentValidations = {
    createStudentValidationSchema
};