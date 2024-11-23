import { Router } from 'express';


import { exampleRouter } from '@/infra/http/routes/example.routes';


const routes = Router();

routes.use('/example', exampleRouter);

//routes.use(authenticateRouter);

export { routes };
