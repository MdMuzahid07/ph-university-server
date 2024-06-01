import { z } from "zod";

const CreateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic department must be string",
            required_error: "Academic department name is required"
        }),
        academicFaculty: z.string({
            invalid_type_error: "Academic faculty must be string",
            required_error: "Faculty is required"
        })
    })
});

const UpdateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic department must be string",
            required_error: "Academic department name is required"
        }).optional(),
        academicFaculty: z.string({
            invalid_type_error: "Academic faculty must be string",
            required_error: "Faculty is required"
        }).optional()
    })
});

export const AcademicDepartmentValidation = {
    CreateAcademicDepartmentValidationSchema,
    UpdateAcademicDepartmentValidationSchema
};