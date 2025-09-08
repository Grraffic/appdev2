const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required().messages({
    "string.base": "Username must be a string",
    "string.alphanum": "Username must only contain alphanumeric characters",
    "string.min": "Username must be at least 3 characters long",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

module.exports = {
  signupSchema,
  signinSchema,
};
