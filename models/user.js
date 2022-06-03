const { string } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");
// const passwordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    requried: true,
  },
  password2: {
    type: String,
    requried: true,
  },
});

const User = mongoose.model("User", userSchema);

function validateRegistration(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).required().messages({
      "string.min": `"Full Name must be at least 5 characters"`,
      "any.required": `"Full Name is required"`,
      "string.empty": `"Full Name cannot be an empty field`,
    }),
    email: Joi.string().min(10).required().email().messages({
      "string.min": "Email must be at least 10 characters",
      "string.required": "Email is required",
      "string.email": "Email is invalid",
    }),
    password: Joi.required().messages({
      "string.required": "Password is required",
    }),
    password2: Joi.required().equal(Joi.ref("password")).messages({
      "string.required": "Password is required",
      "string.empty": "Password cannot be an empty field",
      "any.only": "Password do not match",
    }),
  });

  return schema.validate(user);
}

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(10).required().email(),
    password: Joi.required(),
  });

  return schema.validate(user);
}
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateRegistration = validateRegistration;
