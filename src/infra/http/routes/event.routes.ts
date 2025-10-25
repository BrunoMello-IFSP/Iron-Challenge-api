import { Router } from "express";

import { celebrate, Joi, Segments } from "celebrate";
import { EventCreate, EventDelete } from "../controller/EventController";

const eventRouter = Router();
const eventCreateController = new EventCreate();
const eventDeleteController = new EventDelete();

// Rota para criação de evento
eventRouter.post(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+$/)
        .required(),
    }).unknown(true),
    [Segments.BODY]: {
      name: Joi.string().required().min(3).max(255),
      description: Joi.string().required().min(5).max(500),
      startDate: Joi.date().iso().required(),
      finishDate: Joi.date().iso().required(),
      categories: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            weightRequirement: Joi.number().min(0).required(),
          })
        )
        .required(),
    },
  }),
  eventCreateController.handle,
);


eventRouter.delete(
  "/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().pattern(/^Bearer\s[\w-]+$/).required(),
    }).unknown(true),
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  eventDeleteController.handle
);


export { eventRouter };
