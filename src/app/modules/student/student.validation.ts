import { z } from 'zod';

const createNameValidationSchema = z.object({
    firstName: z.string().trim().min(1).max(20, "Name cannot be more than 20 characters"),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim(),
});

const createGuardianValidationSchema = z.object({
    fatherName: z.string().trim(),
    motherName: z.string().trim(),
    fatherContactNo: z.string().trim(),
    motherContactNo: z.string().trim(),
    fatherOccupation: z.string().trim(),
    motherOccupation: z.string().trim(),
});

const createLocalGuardianValidationSchema = z.object({
    name: z.string().trim(),
    occupation: z.string().trim(),
    contactNo: z.string().trim(),
    address: z.string().trim(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        student: z.object({
            name: createNameValidationSchema,
            gender: z.enum(["male", "female", "others"]),
            dateOfBirth: z.string().optional(),
            email: z
                .string()
                .email({ message: '{VALUE} is not a valid email' })
            ,
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            contactNumber: z.string().trim(),
            emergencyContactNo: z.string().trim(),
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            presentAddress: z.string().trim(),
            permanentAddress: z.string().trim(),
            // profileImage: z.string().optional(),
            admissionSemester: z.string(),
            academicDepartment: z.string()
        })
    })
});



const updateNameValidationSchema = z.object({
    firstName: z.string().trim().min(1).max(20, "Name cannot be more than 20 characters").optional(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().trim().optional(),
    motherName: z.string().trim().optional(),
    fatherContactNo: z.string().trim().optional(),
    motherContactNo: z.string().trim().optional(),
    fatherOccupation: z.string().trim().optional(),
    motherOccupation: z.string().trim().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
    name: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    contactNo: z.string().trim().optional(),
    address: z.string().trim().optional(),
});

const updateStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        student: z.object({
            name: updateNameValidationSchema.optional(),
            gender: z.enum(["male", "female", "others"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string()
                .email({ message: '{VALUE} is not a valid email' })
                .optional(),
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            contactNumber: z.string().trim().optional(),
            emergencyContactNo: z.string().trim().optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            presentAddress: z.string().trim().optional(),
            permanentAddress: z.string().trim().optional(),
            profileImage: z.string().optional(),
            admissionSemester: z.string().optional(),
            academicDepartment: z.string().optional()
        })
    })
});





export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema
};