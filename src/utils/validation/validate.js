import { registrationSchema, loginSchema } from "./schemas";

function validateRegister(user) {
  return registrationSchema.validate(user);
}

function validateLogin(user) {
  return loginSchema.validate(user);
}

export { validateRegister, validateLogin };
