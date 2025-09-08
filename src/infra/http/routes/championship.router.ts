import { Router } from "express";
import { ChampionshipController } from "../controller/championshipController";
import { celebrate, Joi, Segments } from "celebrate";



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




export { championshipRouter }