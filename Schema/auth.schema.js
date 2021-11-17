const joi =  require('joi');

const registerSchema = joi.object({
  firstname: joi.string().min(3).required(),
  lastname: joi.string().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const forgetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  time:joi.required()
});

const checkcode = joi.object({
  code: joi.string().min(6).max(6).required(),
  id: joi.string().required()
});

const createnewpassword = joi.object({
  password: joi.string().min(6).required(),
  id: joi.string().required()
});

const linkvalid = joi.object({
  time:joi.required(),
  id:joi.string().required()
})

module.exports = {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  checkcode,
  createnewpassword,
  linkvalid,
};
