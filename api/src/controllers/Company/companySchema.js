const z = require("zod");

const companySchema = z.object({
  name: z.string({
    invalid_type_error: "El nombre debe ser una cadena de carácteres.",
  }),
  nit: z.number({
    invalid_type_error: "El campo NIT debe ser un numero.",
  }),
  active: z.boolean({
    invalid_type_error: "Active debe ser un valor booleano.",
  }),
});

const validateCompany = (input) => {
  return companySchema.partial().safeParse(input);
};

const validateUpdateCompany = (input) => {
  return companySchema.partial().safeParse(input);
};

module.exports = {
  validateCompany,
  validateUpdateCompany,
};
