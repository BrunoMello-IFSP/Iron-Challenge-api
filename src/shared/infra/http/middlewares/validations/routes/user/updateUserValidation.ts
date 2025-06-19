import { Joi, Segments } from 'celebrate';

export const updateUserValidation = {
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().pattern(/^Bearer\s[\w-]+$/).required(),
  }).unknown(),
  [Segments.BODY]: Joi.object({
    name: Joi.string().optional(),
    cpf: Joi.string().optional(),
    birthDate: Joi.date().optional(),
    sex: Joi.string().valid('M', 'F', 'Other').optional(),
    phone: Joi.number().optional(),
    email: Joi.string().email(),
    role: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      number: Joi.number().optional(),
      neighborhood: Joi.string().optional(),
      complement: Joi.string().optional(),
      city: Joi.string().optional(),
      uf: Joi.string().length(2).optional(),
      zipCode: Joi.string().optional(),
    }).optional(),
  }),
};
