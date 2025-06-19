import { Router } from "express";
import { RegistrationController } from "../controller/RegistrationController";
import { celebrate, Joi, Segments } from "celebrate";


const registrationRouter = Router();
const registrationController = new RegistrationController();

// Rota para criação da inscription
registrationRouter.post(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+$/)
        .required(),
    }).unknown(true),
    [Segments.BODY]: Joi.object({
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
      competitorWeight: Joi.number().required(),
    }),
  }),
  registrationController.handle,
);

registrationRouter.patch(
  '/:registrationId',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+$/)
        .required(),
    }).unknown(true),
    [Segments.PARAMS]: Joi.object({
      registrationId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object({
      categoryId: Joi.string().optional(),
      competitorWeight: Joi.number().optional(),
    }).min(1),
  }),
  registrationController.update,
);

registrationRouter.get(
  '/list',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+$/)
        .required(),
    }).unknown(true),
    [Segments.QUERY]: Joi.object({
      eventId: Joi.string().optional(),
      categoryId: Joi.string().optional(),
    }),
  }),
  registrationController.list.bind(registrationController)
);

export { registrationRouter }