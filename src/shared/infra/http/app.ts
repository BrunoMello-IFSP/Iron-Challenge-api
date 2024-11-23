/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';
import './mongodb/index';
import 'dotenv/config';

import { errors as celebrateErrors } from 'celebrate';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';
import http from 'http';
import swaggerUi from 'swagger-ui-express';

import AppError from '@/shared/errors/AppError';

import swaggerFile from '../../../swagger.json';
import { routes } from './routes';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use(routes);

const swaggerOptions = {
  customSiteTitle: 'Api eManager',
  tagsSorter: 'alpha',
  filter: true,
  docExpansion: 'none',
};

const swaggerUsers: { [key: string]: string } = {};

if (process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD) {
  swaggerUsers[process.env.SWAGGER_USER] = process.env.SWAGGER_PASSWORD;
} else {
  console.error(
    'Variáveis de ambiente SWAGGER_USER ou SWAGGER_PASSWORD não definidas.',
  );
}

app.use(
  '/docs',
  basicAuth({
    users: swaggerUsers,
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, swaggerOptions),
);

app.use(celebrateErrors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export { app, server };
