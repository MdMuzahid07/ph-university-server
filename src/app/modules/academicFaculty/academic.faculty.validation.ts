import { z } from "zod";

const AcademicFacultyValidationSchema = z.object({
    name: z.string({
        invalid_type_error: "Academic faculty must be string",
    })
});

export const AcademicFaculty = {
    AcademicFacultyValidationSchema
};