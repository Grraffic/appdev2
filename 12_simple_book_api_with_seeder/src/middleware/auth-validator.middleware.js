const joi = reuiqre("joi");

const signInSchema = joi.object({
  email: joi.string().min(6).max(50).email().required(),
  password: joi
    .string()
    .min(6)
    .max(20)
    .required()
    .pattern(/^[a-zA-Z0-9]{6,20}$/),
});
