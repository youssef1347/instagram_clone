const joi = require("joi");

// register validation
const registerSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

// login validation
const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};