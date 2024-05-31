import { z } from "zod";
import { academicSemesterCode, academicSemesterName, Months } from "./academic.semester.constants";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...academicSemesterName] as [string, ...string[]]),
        year: z.string(),
        code: z.enum([...academicSemesterCode] as [string, ...string[]]),
        startMonth: z.enum([...Months] as [string, ...string[]]),
        endMonth: z.enum([...Months] as [string, ...string[]])
    })
});


const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...academicSemesterName] as [string, ...string[]]).optional(),
        year: z.string().optional(),
        code: z.enum([...academicSemesterName] as [string, ...string[]]).optional(),
        startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
        endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    }),
});

export const AcademicSemesterValidation = {
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
};