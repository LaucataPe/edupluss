const z = require("zod");

const testGradeSchema = z.object({
    id: z.number(),
    activityId: z.number(),
    userId: z.number({
        required_error: "El id del usuario es un valor requerido"
    }),
    gradeValue: z.number({
        invalid_type_error: "La calificación debe ser un número."
    }),
    maximunGradeValue: z.number({
        invalid_type_error: "La calificación máxima debe ser un número."
    }),
    testWatched: z.boolean({
        invalid_type_error: "testWatched debe ser un valor booleano."
    }),
    errorTest: z.boolean({
        invalid_type_error: "errorTest debe ser un valor booleano."
    }),
})

const validateTestGrade = (input) => {
    return testGradeSchema.partial().safeParse(input);
}

const validateUpdateTestGrade = (input) => {
    return testGradeSchema.partial().safeParse(input);
}

module.exports = {
    validateTestGrade,
    validateUpdateTestGrade
}
