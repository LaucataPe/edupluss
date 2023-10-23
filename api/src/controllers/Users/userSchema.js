const z = require("zod");

const userSchema = z.object({
    id: z.number({
        required_error: "El id del usuario es un valor requerido"
    }),
    username: z.string({
        invalid_type_error: "El nombre del usuario debe ser una cadena de carácteres"
    }),
    email: z.string({
        invalid_type_error: "El email debe ser una cadena de carácteres"
    }),
    password: z.string({
        invalid_type_error: "La contraseña del usuario debe ser una cadena de carácteres"
    }),
    newPassword: z.string({
        invalid_type_error: "La contraseña del usuario debe ser una cadena de carácteres"
    }),
    avatarImage: z.string({
        invalid_type_error: "El avatar del usuario debe ser una cadena de carácteres"
    }),
    active: z.boolean({
        invalid_type_error: "El estado active del usuario debe ser un valor booleano"
    }),
    tipo: z.string({
        invalid_type_error: "El tipo del usuario debe ser una cadena de carácteres"
    }),
    roleId: z.number({
        invalid_type_error: "El cargo del usuario debe ser un número"
    }), 
})

const validateUser = (input) => {
    return userSchema.partial().safeParse(input);
}

const validateUpdateUser = (input) => {
    return userSchema.partial().safeParse(input);
}

module.exports = {
    validateUser,
    validateUpdateUser
}