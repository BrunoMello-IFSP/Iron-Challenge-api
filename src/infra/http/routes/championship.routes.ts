import { Router } from "express";

import { celebrate, Joi, Segments } from "celebrate";
import { ChampionshipController } from "../controller/ChampionshipController";



const championshipRouter = Router();
const championshipController = new ChampionshipController();


// Rota para gerar ordem de entrada
championshipRouter.post(
  '/generateEntry',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string()
        .pattern(/^Bearer\s[\w-]+$/)
        .required(),
    }).unknown(),

    [Segments.QUERY]: Joi.object({
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
    }),
  }),
  championshipController.generate.bind(championshipController)
);

championshipRouter.get(
  '/orderList',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: Joi.object({
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
    }),
  }),
  championshipController.list.bind(championshipController)
);

//Rota para adicionar pontuação
championshipRouter.patch(
  '/score',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.BODY]: Joi.object({
      _id: Joi.string().required(),
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
      attended: Joi.boolean().allow(null),
      repetition: Joi.number().allow(null),
    }),
  }),
  championshipController.updatePoints.bind(championshipController)
);

// Resultado em tempo real
championshipRouter.get(
  '/result',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: Joi.object({
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
    }),
  }),
  championshipController.getResult.bind(championshipController)
);

//Campeoes
championshipRouter.patch(
  '/winners',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    [Segments.QUERY]: Joi.object({
      eventId: Joi.string().required(),
      categoryId: Joi.string().required(),
    }),
  }),
  championshipController.winners.bind(championshipController)
);


export { championshipRouter }