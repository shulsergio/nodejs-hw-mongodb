import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(30).required().messages({
    'any.required': 'Phone Number is required',
  }),
  email: Joi.string().email().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name should be a string',
  }),
  phoneNumber: Joi.string().min(3).max(30).messages({
    'any.required': 'Phone Number is required',
  }),
  email: Joi.string().email().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
